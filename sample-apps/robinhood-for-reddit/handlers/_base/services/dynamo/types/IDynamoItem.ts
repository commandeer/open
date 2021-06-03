import { DynamoTransactionType } from './DynamoTransactionType';

export interface IDynamoItem {
  tableName: string;
  content: any;
}

export interface IDynamoItemPut extends IDynamoItem {
  conditionExpression?: string;
}

export interface IDynamoItemUpdate extends IDynamoItem {
  keyValue?: string;
  keyName?: string;
  conditionExpression?: string;
}

export interface IDynamoTransactionItem extends IDynamoItem {
  method: DynamoTransactionType;
}

export interface IDynamoTransactionItemPut extends IDynamoItemPut, IDynamoTransactionItem {}
export interface IDynamoTransactionItemUpdate extends IDynamoItemUpdate, IDynamoTransactionItem {}
