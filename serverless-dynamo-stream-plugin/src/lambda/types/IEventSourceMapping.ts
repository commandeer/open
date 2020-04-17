import { EventSourceMappingState } from '@/lambda/types/EventSourceMappingState';

export interface IEventSourceMapping {
  id?: string;
  batchSize?: number;
  maximumBatchingWindowInSeconds?: number;
  parallelizationFactor?: number;
  eventSourceArn?: string;
  functionArn?: string;
  lastModified?: Date;
  lastProcessingResult?: string;
  state?: EventSourceMappingState;
  stateTransitionReason?: string;
  destinationConfig?: any;
  maximumRecordAgeInSeconds?: number;
  bisectBatchOnFunctionError?: boolean;
  maximumRetryAttempts?: number;
}
