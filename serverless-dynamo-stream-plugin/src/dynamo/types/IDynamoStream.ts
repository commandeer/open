import { DynamoStreamType } from './DynamoStreamType';
import { EventSourcePosition } from '../../_base/EventSourcePosition';

export interface IDynamoStream {
  tableName: string;
  streamType?: DynamoStreamType;
  startingPosition?: EventSourcePosition;
}
