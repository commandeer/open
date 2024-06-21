import { EventName } from '@/handlers/_base/services/dynamo/types/EventName';

/**
 * @description DynamoDB record coming from a stream.
 */
export interface IRecord {
  eventName: EventName;
  dynamodb: {
    NewImage?: any;
    OldImage?: any;
  }
}
