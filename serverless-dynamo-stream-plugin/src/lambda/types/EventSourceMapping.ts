import { IEventSourceMapping } from './IEventSourceMapping';

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
