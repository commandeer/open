import { IRecord } from '@/handlers/_base/services/dynamo/types/IRecord';

/**
 * @description dynamo stream event.
 */
export interface IDynamoStreamEvent {
  Records: IRecord[]
}
