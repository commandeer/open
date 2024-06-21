/**
 * @description represents a filter statement for DynamoDB.
 * @example {
 *   filterExpression: "#firstName = :firstName,
 *   additionalKeys: {
 *     '#firstName': 'firstName', // <-- avoids collisions with the reserved Dynamo keywords
 *   },
 *   additionalValues: {
 *     ':firstName': 'John Smith',
 *   },
 * }
 */
export interface IDynamoFilter {
  filterExpression: string;
  additionalKeys: { [key: string]: string };
  additionalValues: { [key: string]: any };
}
