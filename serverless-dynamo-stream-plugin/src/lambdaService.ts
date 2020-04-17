import Lambda from 'aws-sdk/clients/lambda';

export interface IFunctionConfiguration {
  roleArn?: string;
}

export class FunctionConfiguration implements IFunctionConfiguration {
  roleArn?: string;

  constructor(configuration?: IFunctionConfiguration) {
    if (configuration) {
      if (configuration.roleArn) {
        this.roleArn = configuration.roleArn;
      }
    }
  }
}

export interface IEventSourceMapping {
  eventSourceArn?: string;
  functionArn?: string;
}

export class EventSourceMapping implements IEventSourceMapping {
  eventSourceArn?: string;
  functionArn?: string;

  constructor(mapping?: IEventSourceMapping) {
    if (mapping) {
      this.eventSourceArn = mapping?.eventSourceArn;
      this.functionArn = mapping?.functionArn;
    }
  }
}

export class LambdaService {
  private readonly client: Lambda;

  constructor(client = new Lambda()) {
    this.client = client;
  }

  async getFunctionConfiguration(functionName: string): Promise<FunctionConfiguration | undefined> {
    try {
      const params: Lambda.GetFunctionConfigurationRequest = {
        FunctionName: functionName,
      };

      const response = await this.client.getFunctionConfiguration(params).promise();

      return response
        ? new FunctionConfiguration({ roleArn: response.Role, })
        : undefined;
    } catch (error) {
      throw error;
    }
  }

  async listEventSourceMappings(functionName: string): Promise<EventSourceMapping[]> {
    try {
      const params: Lambda.ListEventSourceMappingsRequest = {
        FunctionName: functionName,
      };

      const response = await this.client.listEventSourceMappings(params).promise();

      return response
        .EventSourceMappings?.map(mapping => {
          return {
            eventSourceArn: mapping.EventSourceArn,
            functionArn: mapping.FunctionArn
          }
        }) ?? [];
    } catch (error) {
      throw error
    }
  }
}
