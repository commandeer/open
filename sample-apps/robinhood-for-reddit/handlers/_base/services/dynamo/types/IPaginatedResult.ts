export interface IPaginatedResult<Type> {
  items: Type[];
  nextToken?: any;
}
