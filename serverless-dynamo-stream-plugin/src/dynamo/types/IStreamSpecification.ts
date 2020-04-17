import { DynamoStreamType } from './DynamoStreamType';

export interface IStreamSpecification {
  isEnabled: boolean;
  viewType?: DynamoStreamType;
}
