import { IDynamoStream } from './IDynamoStream';
import { DynamoStreamType } from './DynamoStreamType';
import { EventSourcePosition } from '../../_base/EventSourcePosition';

export class DynamoStream implements IDynamoStream {
  tableName: string;
  streamType: DynamoStreamType = DynamoStreamType.NEW_AND_OLD_IMAGES;
  startingPosition: EventSourcePosition = EventSourcePosition.LATEST;

  constructor(stream: IDynamoStream) {
    this.tableName = stream.tableName;

    // set some optional params if they are present
    if (stream.streamType) {
      this.streamType = stream.streamType;
    }
    if (stream.startingPosition) {
      this.startingPosition = stream.startingPosition;
    }
  }
}
