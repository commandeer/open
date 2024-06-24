import { IEventSourceMapping } from './IEventSourceMapping';
import { EventSourceMappingState } from './EventSourceMappingState';

export class EventSourceMapping implements IEventSourceMapping {
  id?: string;
  batchSize?: number;
  destinationConfig?: any;
  bisectBatchOnFunctionError?: boolean;
  eventSourceArn?: string;
  functionArn?: string;
  maximumBatchingWindowInSeconds?: number;
  maximumRecordAgeInSeconds?: number;
  maximumRetryAttempts?: number;
  lastModified?: Date;
  lastProcessingResult?: string;
  parallelizationFactor?: number;
  state?: EventSourceMappingState;
  stateTransitionReason?: string;

  constructor(mapping?: IEventSourceMapping) {
    if (mapping) {
      this.id = mapping?.id;
      this.batchSize = mapping?.batchSize;
      this.destinationConfig = mapping?.destinationConfig;
      this.bisectBatchOnFunctionError = mapping?.bisectBatchOnFunctionError;
      this.functionArn = mapping?.functionArn;
      this.eventSourceArn = mapping?.eventSourceArn;
      this.maximumBatchingWindowInSeconds = mapping?.maximumBatchingWindowInSeconds;
      this.maximumRecordAgeInSeconds = mapping?.maximumRecordAgeInSeconds;
      this.maximumRetryAttempts = mapping?.maximumRetryAttempts;
      this.lastModified = mapping?.lastModified;
      this.lastProcessingResult = mapping?.lastProcessingResult;
      this.parallelizationFactor = mapping?.parallelizationFactor;
      this.state = mapping?.state;
      this.stateTransitionReason = mapping?.stateTransitionReason;
    }
  }
}
