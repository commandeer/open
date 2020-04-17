'use strict';

import Dynamo from 'aws-sdk/clients/dynamodb';
import Iam from 'aws-sdk/clients/iam';
import Lambda from 'aws-sdk/clients/lambda';
import { config } from 'aws-sdk';
import Serverless from 'serverless'
import { DynamoStream, IDynamoStream, StreamSpecification } from './types';
import { DynamoService } from './dynamo/dynamoService';
import { LambdaService } from './lambda/lambdaService';
import { IamService } from './iam/iamService';

export class ServerlessDynamoStreamPlugin {

  readonly dynamoService: DynamoService;
  readonly lambdaService: LambdaService;
  readonly iamService: IamService;

  // TODO: delete the clients once all services are in
  readonly dynamoClient: Dynamo;
  readonly iamClient: Iam;
  readonly lambdaClient: Lambda;

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

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;

    // set the plugin to be runnable as a command
    this.commands = {
      'dynamo-stream': {
        usage: 'Creates and connects DynamoDB streams for pre-existing tables with AWS Lambdas',
        lifecycleEvents: ['create', 'connect'],
      },
    };

    // bind the lifecycle hooks
    this.hooks = {
      'dynamoStream:create': this.createDynamoStream.bind(this),
      'dynamoStream:connect': this.connectDynamoStreamToLambda.bind(this),
      'after:deploy:deploy': this.runAll.bind(this),
    };

    // configure AWS.
    config.update({
      region: serverless.service.provider.region,
      apiVersions: {
        dynamodb: '2012-08-10',
      }
    });

    // instantiate AWS clients
    this.dynamoClient = new Dynamo();
    this.lambdaClient = new Lambda();
    this.iamClient = new Iam();

    this.dynamoService = new DynamoService();
    this.lambdaService = new LambdaService();
    this.iamService = new IamService();
  }

  async runAll() {
    await this.createDynamoStream();
    await this.connectDynamoStreamToLambda();
  }

  /**
   * @description creates or updates Dynamo streams if needed.
   */
  async createDynamoStream(): Promise<boolean> {
    this.serverless.cli.log('dynamoStream:create - creating/updating DynamoDB streams if needed');
    const lambdaToStreams = this.getLambdaStreams();
    const functionNames = Object.keys(lambdaToStreams);

    // Exit early if there are no existing streams in serverless.yml
    if (functionNames.length <= 0) {
      return false;
    }

    this.serverless.cli.log(`Found some functions for existing dynamo streams: ${functionNames}`);

    // update stream specification for each table and even if needed
    for (const [, events] of Object.entries(lambdaToStreams)) {
      for (const event of events) {
        try {
          const table = await this.dynamoService.describeTable(event.tableName);
          if (!table) {
            this.serverless.cli.log(`Table ${event.tableName} is not found, skipping dynamo stream creation.`);
            continue;
          }

          const stream = table.streamSpecification;

          // update the stream if it's not enabled or its stream type is not what's specified in serverless.yml
          if (!stream || !stream.isEnabled || (stream.isEnabled && stream.viewType !== event.streamType)) {
            this.serverless.cli.log(`Updating the stream for table ${event.tableName} to ${event.streamType}`);
            let updateStream = new StreamSpecification({
              isEnabled: true,
              viewType: event.streamType,
            });
            updateStream.isEnabled = true;
            await this.dynamoService.updateTable(event.tableName, updateStream);
          }
        } catch (error) {
          this.serverless.cli.log(`Error updating a stream for table ${event.tableName}: ${error.message ? error.message : error }`
            + ' Skipping dynamo stream update.');
        }
      }
    }

    return true;
  }

  async connectDynamoStreamToLambda(): Promise<boolean> {
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
          // get a table stream arn
          const table = await this.dynamoService.describeTable(event.tableName);
          const streamArn = table?.latestStreamArn;

          if (!table) {
            throw new Error(`Table ${event.tableName} doesn't exist.`);
          }

          if (!streamArn) {
            throw new Error('Failed to find the stream arn to connect the lambda to.');
          }

          // get a function arn, function role name
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

          this.serverless.cli.log(`Fetched role name ${lambdaRoleName} for lambda ${fullFunctionName}`);

          // find the role policy
          const policyNames = await this.iamService.listRolePolicies(lambdaRoleName);
          const policyName = policyNames.find(name => name.includes(this.serverless.service.getServiceName()));
          if (!policyName) {
            throw new Error('Couldn\'t find Serverless policy, please make sure Serverless deploy succeeds first.')
          }

          this.serverless.cli.log(`Found policy name ${policyName} for lambda ${fullFunctionName}`);

          const rolePolicy = await this.iamService.getRolePolicy(lambdaRoleName, policyName);

          // figure out if the stream permissions already exist on the stream
          const policyDocument = JSON.parse(decodeURIComponent(rolePolicy.policyDocument));
          const alreadyAllowsDynamoStream = policyDocument.Statement
            .some((statement: any) => statement.Resource.includes(streamArn)
              && this.requiredDynamoStreamPermissions.every(requiredPermission => statement.Action.includes(requiredPermission))
              && statement.Effect === 'Allow');

          // add a new policy to the existing document if needed
          if (alreadyAllowsDynamoStream) {
            this.serverless.cli.log(`Role ${lambdaRoleName} already has a policy for ${streamArn}`);
          } else {
            policyDocument.Statement.push({
              Action: this.requiredDynamoStreamPermissions,
              Resource: [streamArn],
              Effect: 'Allow',
            });

            // create the new policy on AWS
            this.serverless.cli.log(`Creating a new policy for Role ${lambdaRoleName} to access the stream ${streamArn}`);

            rolePolicy.policyDocument = JSON.stringify(policyDocument);
            await this.iamService.putRolePolicy(rolePolicy);
          }

          // create an event mapping
          this.serverless.cli.log(
            `Creating event mapping between lambda ${functionName} and DynamoDB stream for table ${event.tableName}`
          );
          await this.lambdaService.createEventSourceMapping(streamArn, fullFunctionName, event.startingPosition);

        } catch (error) {
          this.serverless.cli.log(`Failed to get the stream arn for table ${event.tableName}.`
            + ` Error: ${error.message ? error.message : error}`);
        }
      }
    }

    return true;
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

}

module.exports = ServerlessDynamoStreamPlugin;
