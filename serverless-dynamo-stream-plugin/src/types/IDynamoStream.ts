import { DynamoStreamType } from './DynamoStreamType';
import { EventSourcePosition } from './EventSourcePosition';

export interface IDynamoStream {
  tableName: string;
  streamType?: DynamoStreamType;
  startingPosition?: EventSourcePosition;
}
