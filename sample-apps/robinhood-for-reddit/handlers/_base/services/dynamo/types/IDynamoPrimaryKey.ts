export interface IDynamoPrimaryKey {
  partitionKeyName: string;
  partitionKeyValue: string;
  sortKeyName?: string;
  sortKeyValue?: string;
}
