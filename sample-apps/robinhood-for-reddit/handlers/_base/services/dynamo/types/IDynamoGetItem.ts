import { IDynamoPrimaryKey } from '@/handlers/_base/services/dynamo/types/IDynamoPrimaryKey';

export interface IDynamoGetItem {
  tableName: string;
  keyValues: IDynamoPrimaryKey[]
}
