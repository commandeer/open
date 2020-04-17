import Lambda from 'aws-sdk/clients/lambda';
import { EventSourceMapping, FunctionConfiguration } from './types';
import { EventSourcePosition } from '@/_base/EventSourcePosition';

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

      return response.EventSourceMappings?.map(mapping => this.parseEventSourceMapping(mapping)) ?? [];
    } catch (error) {
      throw error
    }
  }

  async createEventSourceMapping(eventSourceArn: string, functionName: string, position: EventSourcePosition): Promise<EventSourceMapping> {
    try {
      const params: Lambda.CreateEventSourceMappingRequest = {
        EventSourceArn: eventSourceArn,
        FunctionName: functionName,
        StartingPosition: position,
      };

      const response = await this.client.createEventSourceMapping(params).promise();
      return this.parseEventSourceMapping(response);

    } catch (error) {
      throw error;
    }
  }

  private parseEventSourceMapping(configuration: Lambda.EventSourceMappingConfiguration): EventSourceMapping {
    return {
      eventSourceArn: configuration.EventSourceArn,
      functionArn: configuration.FunctionArn
    }
  }
}
