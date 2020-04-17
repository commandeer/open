import Lambda from 'aws-sdk/clients/lambda';
import { EventSourceMapping, EventSourceMappingState, FunctionConfiguration } from './types';
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

      return response.EventSourceMappings?.map(mapping => LambdaService.parseEventSourceMapping(mapping)) ?? [];
    } catch (error) {
      throw error
    }
  }

  async createEventSourceMapping(
    eventSourceArn: string,
    functionName: string,
    position: EventSourcePosition,
    isEnabled: boolean = true
  ): Promise<EventSourceMapping> {

    try {
      const params: Lambda.CreateEventSourceMappingRequest = {
        EventSourceArn: eventSourceArn,
        FunctionName: functionName,
        StartingPosition: position,
        Enabled: isEnabled,
      };

      const response = await this.client.createEventSourceMapping(params).promise();
      return LambdaService.parseEventSourceMapping(response);

    } catch (error) {
      throw error;
    }
  }

  async updateEventSourceMapping(mapping: EventSourceMapping, isEnabled: boolean = true): Promise<EventSourceMapping> {

    try {
      if (!mapping.id) {
        throw new Error('Updating an event source mapping requires an id');
      }

      const params: Lambda.UpdateEventSourceMappingRequest = {
        UUID: mapping.id,
        FunctionName: mapping.functionArn,
        Enabled: isEnabled,
        BatchSize: mapping.batchSize,
        MaximumBatchingWindowInSeconds: mapping.maximumBatchingWindowInSeconds,
        DestinationConfig: mapping.destinationConfig,
        MaximumRecordAgeInSeconds: mapping.maximumRecordAgeInSeconds,
        BisectBatchOnFunctionError: mapping.bisectBatchOnFunctionError,
        MaximumRetryAttempts: mapping.maximumRetryAttempts,
        ParallelizationFactor: mapping.parallelizationFactor,
      };

      const response = await this.client.updateEventSourceMapping(params).promise();
      return LambdaService.parseEventSourceMapping(response);

    } catch (error) {
      throw error;
    }
  }

  private static parseEventSourceMapping(configuration: Lambda.EventSourceMappingConfiguration): EventSourceMapping {
    return new EventSourceMapping({
      id: configuration.UUID,
      batchSize: configuration.BatchSize,
      destinationConfig: configuration.DestinationConfig,
      bisectBatchOnFunctionError: configuration.BisectBatchOnFunctionError,
      eventSourceArn: configuration.EventSourceArn,
      functionArn: configuration.FunctionArn,
      maximumBatchingWindowInSeconds: configuration.MaximumBatchingWindowInSeconds,
      maximumRecordAgeInSeconds: configuration.MaximumRecordAgeInSeconds,
      maximumRetryAttempts: configuration.MaximumRetryAttempts,
      lastModified: configuration.LastModified,
      lastProcessingResult: configuration.LastProcessingResult,
      parallelizationFactor: configuration.ParallelizationFactor,
      state: configuration?.State as EventSourceMappingState,
      stateTransitionReason: configuration.StateTransitionReason,
    });
  }
}
