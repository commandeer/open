import 'module-alias/register';
import Serverless from 'serverless'
import { config } from 'aws-sdk';
import { DynamoService } from './dynamo/dynamoService';
import { LambdaService } from './lambda/lambdaService';
import { IamService } from './iam/iamService';
import { DynamoStream, DynamoStreamType, IDynamoStream, StreamSpecification, Table } from './dynamo/types';
import { RolePolicy } from './iam/types';
import { EventSourcePosition } from './_base/EventSourcePosition';
import { EventSourceMappingState } from './lambda/types';

export class ServerlessDynamoStreamPlugin {

  readonly dynamoService: DynamoService;
  readonly lambdaService: LambdaService;
  readonly iamService: IamService;

  // Serverless parameters
  readonly serverless: Serverless;
  readonly options: Serverless.Options;

  /**
   * @description the key in serverless.yml
   */
  readonly existingStreamKey: string = 'existingDynamoStream';
  readonly requiredDynamoStreamPermissions = [
    'dynamodb:GetRecords',
    'dynamodb:GetShardIterator',
    'dynamodb:DescribeStream',
    'dynamodb:ListStreams'
  ];

  /**
   * @description hooks in the plugin command into the Serverless command lifecycle.
   */
  readonly hooks: { [key: string]: any };

  /**
   * @description exposes some commands for running it in the standalone mode.
   */
  readonly commands: { [key: string]: any };

  /**
   * @description number of milliseconds to wait for AWS to finalize all the things.
   */
  readonly finalWaitPeriod: number = 60000;

  private readonly maxIamWaitAttempts: number = 3;
  private readonly iamWaitIntervalMillis: number = 5000;

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;

    // set the plugin to be runnable as a command
    this.commands = {
      'dynamo-stream': {
        usage: 'Creates and connects DynamoDB streams for pre-existing tables with AWS Lambdas',
        lifecycleEvents: ['connect'],
      },
    };

    // bind the lifecycle hooks
    this.hooks = {
      'dynamo-stream:connect': this.run.bind(this),
      'after:deploy:deploy': this.run.bind(this),
    };

    // define the new event schema if serverless supports it
    if ((serverless as any).configSchemaHandler) {
      (serverless as any).configSchemaHandler.defineFunctionEvent('aws', 'existingDynamoStream', {
        type: 'object',
        properties: {
          tableName: { type: 'string' },
          streamType: { type: 'string' },
          startingPosition: { type: 'string' },
        },
        required: ['tableName', 'streamType', 'startingPosition'],
        additionalProperties: false,
      });
    }

    // configure AWS.
    config.update({
      region: serverless.service.provider.region,
      apiVersions: {
        dynamodb: '2012-08-10',
      }
    });

    this.dynamoService = new DynamoService();
    this.lambdaService = new LambdaService();
    this.iamService = new IamService();
  }

  async run(): Promise<boolean> {
    this.serverless.cli.log('dynamoStream:connect - connecting functions to DynamoDB streams');
    const lambdaToStreams = this.getLambdaStreams();

    // Exit early if there are no existing streams in serverless.yml
    if (Object.keys(lambdaToStreams).length <= 0) {
      return true;
    }

    this.serverless.cli.log(`The following functions need some connections: ${Object.keys(lambdaToStreams)}`);

    for (const [functionName, events] of Object.entries(lambdaToStreams)) {
      const functionObject = this.serverless.service.getFunction(functionName);
      const fullFunctionName = functionObject.name;

      for (const event of events) {

        try {
          // get a table stream specification
          let table = await this.getTable(event.tableName);

          // enable the stream if needed
          const updatedTable = await this.enableStreamIfNeeded(event.tableName, event.streamType, table.streamSpecification);
          if (updatedTable) {
            table = updatedTable;
            this.serverless.cli.log(`Updated the stream for table ${event.tableName} to ${event.streamType}`);
          }

          // get a table stream arn
          const streamArn = table?.latestStreamArn;
          if (!streamArn) {
            throw new Error('Failed to find the stream arn to connect the function to.');
          }

          // get a function role name
          const lambdaRoleName = await this.getLambdaRoleName(fullFunctionName);
          this.serverless.cli.log(`Fetched role name ${lambdaRoleName} for lambda ${fullFunctionName}`);

          // get the role policy
          const rolePolicy = await this.getRolePolicy(lambdaRoleName);
          this.serverless.cli.log(`Found policy name ${rolePolicy.policyName} for lambda ${fullFunctionName}`);

          // add new permissions to the role policy if needed
          const newPermissionsAdded = await this.addPermissionsIfNeeded(rolePolicy, streamArn, lambdaRoleName);
          newPermissionsAdded
            ? this.serverless.cli.log(`Created a new policy for Role ${lambdaRoleName} to access the stream ${streamArn}`)
            : this.serverless.cli.log(`Role ${lambdaRoleName} already has a policy for ${streamArn}`);

          // IAM takes some time to propagate,
          // retrying the request and catching the error causes multiple mappings to be created,
          // fetching the policy document says the updated policy is there, where in reality the create mapping call fails,
          // so a real world solution is to wait until IAM catches up.
          // https://github.com/aws/aws-sdk-js/issues/850
          if (newPermissionsAdded) {
            let attempts = 0;
            while (attempts <= this.maxIamWaitAttempts) {

              attempts
                ? this.serverless.cli.log('.')
                : this.serverless.cli.log('Hang in there, IAM takes some time to process new permissions.');

              attempts += 1;
              await this.sleep(this.iamWaitIntervalMillis);
            }
          }

          const mappingCreatedOrActivated = await this.createOrActivateMappingIfNeeded(streamArn, fullFunctionName, event.startingPosition);
          mappingCreatedOrActivated
            ? this.serverless.cli.log(`Mapping of lambda ${fullFunctionName} to table ${event.tableName} stream is now active.`)
            : this.serverless.cli.log(`Active mapping lambda ${fullFunctionName} to table ${event.tableName} stream already exists.`);

        } catch (error) {
          this.serverless.cli.log(`Failed to connect lambda ${fullFunctionName} to table ${event.tableName}.`
            + ` Error: ${error.message ? error.message : error}`);
        }
      }
    }

    return true;
  }

  /**
   * @description add the permissions to the role policy if necessary.
   * @param rolePolicy the role policy to add the permissions to.
   * @param streamArn the stream arn to add the permissions for.
   * @param lambdaRoleName the role name of the lambda.
   */
  private async addPermissionsIfNeeded(rolePolicy: RolePolicy, streamArn: string, lambdaRoleName: string): Promise<boolean> {
    // figure out if the stream permissions already exist on the stream
    const policyDocument = JSON.parse(decodeURIComponent(rolePolicy.policyDocument));
    const alreadyAllowsDynamoStream = policyDocument.Statement
      .some((statement: any) => statement.Resource.includes(streamArn)
        && this.requiredDynamoStreamPermissions.every(requiredPermission => statement.Action.includes(requiredPermission))
        && statement.Effect === 'Allow');

    // add a new policy to the existing document if needed
    let newPermissionsAdded = false;
    if (!alreadyAllowsDynamoStream) {
      policyDocument.Statement.push({
        Action: this.requiredDynamoStreamPermissions,
        Resource: [streamArn],
        Effect: 'Allow',
      });

      // create the new policy on AWS
      rolePolicy.policyDocument = JSON.stringify(policyDocument);
      await this.iamService.putRolePolicy(rolePolicy);
      newPermissionsAdded = true;
    }

    return newPermissionsAdded;
  }

  /**
   * @description get a role policy object.
   * @param lambdaRoleName the name of the lambda role.
   */
  private async getRolePolicy(lambdaRoleName: string): Promise<RolePolicy> {
    const policyNames = await this.iamService.listRolePolicies(lambdaRoleName);
    const policyName = policyNames.find(name => name.includes(this.serverless.service.getServiceName()));
    if (!policyName) {
      throw new Error('Couldn\'t find Serverless policy, please make sure Serverless deploy succeeds first.')
    }

    return this.iamService.getRolePolicy(lambdaRoleName, policyName);
  }

  /**
   * @description gets the role name of the lambda.
   * @param fullFunctionName the full lambda function name including the stage and the service.
   */
  private async getLambdaRoleName(fullFunctionName: string): Promise<string> {
    const configuration = await this.lambdaService.getFunctionConfiguration(fullFunctionName);
    const functionRoleArn = configuration?.roleArn;

    if (!functionRoleArn) {
      throw new Error('Function configuration doesn\'t have a role.' +
        ' Please make sure Serverless deploy succeeds to deploy the lambdas first.');
    }

    const fullLambdaRoleName = functionRoleArn?.split(':').pop();
    const lambdaRoleName = fullLambdaRoleName?.split('/').pop();
    if (!lambdaRoleName) {
      throw new Error(`Lambda role arn ${functionRoleArn} doesn\'t have a name.` +
        ` Make sure the right role is set on lambda ${fullFunctionName}.`);
    }
    return lambdaRoleName;
  }

  /**
   * @description returns an object containing a lambda name as a key and the array of streams as a value.
   */
  getLambdaStreams(): { [key: string]: DynamoStream[] } {
    const lambdaToStreams: { [key: string]: DynamoStream[] } = {};

    // find all lambdas that have a custom event in their attributes
    for (const functionName of this.serverless.service.getAllFunctions()) {
      const events = this.serverless.service.getAllEventsInFunction(functionName);
      const existingStreamEvents = events.filter(event => (event as any)[this.existingStreamKey]);
      if (existingStreamEvents.length > 0) {
        lambdaToStreams[functionName] = existingStreamEvents
          .map(event => new DynamoStream((event as any)[this.existingStreamKey] as IDynamoStream));
      }
    }

    return lambdaToStreams;
  }

  /**
   * @description enables the DynamoDB stream if needed and the returns a new table if updated.
   * @param currentStream the current stream specification.
   * @param tableName the table name for the stream.
   * @param targetStreamType what we want the stream type to be.
   */
  private async enableStreamIfNeeded(
    tableName: string,
    targetStreamType: DynamoStreamType,
    currentStream?: StreamSpecification,
  ): Promise<Table | undefined> {

    // update the stream if it's not enabled or its stream type is not what's specified in serverless.yml
    if (!currentStream || !currentStream.isEnabled || (currentStream.isEnabled && currentStream.viewType !== targetStreamType)) {
      let updateStream = new StreamSpecification({
        isEnabled: true,
        viewType: targetStreamType,
      });
      updateStream.isEnabled = true;

      return this.dynamoService.updateTable(tableName, updateStream);
    } else {
      return undefined;
    }
  }

  /**
   * @description returns the stream specification for the table.
   * @param tableName the table name to look for.
   * @throws an error when the table isn't found.
   */
  private async getTable(tableName: string): Promise<Table> {
    const table = await this.dynamoService.describeTable(tableName);
    if (!table) {
      throw new Error(`Table ${tableName} is not found.`);
    }

    return table;
  }

  /**
   * @description creates a new mapping if it doesn't exist, or activates an inactive existing mapping.
   * @param streamArn the stream arn for the mapping.
   * @param fullFunctionName the function name to connect the mapping to.
   * @param startingPosition the starting position for the stream.
   */
  private async createOrActivateMappingIfNeeded(
    streamArn: string,
    fullFunctionName: string,
    startingPosition: EventSourcePosition
  ): Promise<boolean> {

    const existingMappings = await this.lambdaService.listEventSourceMappings(fullFunctionName);
    let existingMapping = existingMappings.find(mapping => mapping.eventSourceArn === streamArn);
    let createdOrActivated = false;

    if (!existingMapping) {
      // create an active source mapping if it doesn't exist
      await this.lambdaService.createEventSourceMapping(streamArn, fullFunctionName, startingPosition);
      createdOrActivated = true;
    } else if (existingMapping && existingMapping.state !== EventSourceMappingState.ENABLED) {
      // activate an inactive mapping if it exists and it's not active
      if (!existingMapping.id) {
        throw new Error('Updating an event source mapping requires an id');
      }
      await this.lambdaService.enableEventSourceMapping(existingMapping.id);
      createdOrActivated = true;
    }

    return createdOrActivated;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = ServerlessDynamoStreamPlugin;
