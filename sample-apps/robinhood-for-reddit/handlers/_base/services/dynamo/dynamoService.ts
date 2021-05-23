import Dynamo from 'aws-sdk/clients/dynamodb';
import { classToPlain } from 'class-transformer';

import { chunkify } from '@/handlers/_base/lib/chunkify';
import { BaseService } from '@/handlers/_base/services/baseService';
import { Trackable } from '@/handlers/_base/services/Trackable';
import {
  DynamoTransactionType,
  IDynamoFilter,
  IDynamoGetItem,
  IDynamoIndex,
  IDynamoItemUpdate,
  IDynamoItemPut,
  IPaginatedResult,
  IDynamoTransactionItemUpdate,
  IDynamoTransactionItemPut,
} from '@/handlers/_base/services/dynamo/types';
import { ConfigApi } from '@/handlers/_base/config';

const config = ConfigApi.loadByEnvironment();

const putItemFormat = ({ tableName, content }: IDynamoItemPut): Dynamo.DocumentClient.PutItemInput => ({
  TableName: tableName,
  Item: content instanceof Trackable ? classToPlain(content) : { ...content },
});

const buildUpdateQuery = (method, tableName, data, keyValue, keyName = 'id', conditionExpression?) => {
  // put together some parameters and the update expression
  // should be something like this: "set user_id = :user_id"
  // and { ':user_id': 'abc123' } should be in expressionAttributes.
  const updateExpression: string[] = [];
  const ExpressionAttributeValues = {};
  const ExpressionAttributeNames = {};

  for (const [key, value] of data) {
    // put together the update expression with attribute values.
    updateExpression.push(method.toUpperCase() === 'SET'
      ? `#${key} = :${key}`
      : `#${key} :${key}`);

    ExpressionAttributeValues[`:${key}`] = value;
    ExpressionAttributeNames[`#${key}`] = key;
  }

  return {
    TableName: tableName,
    Key: { [keyName]: keyValue },
    UpdateExpression: `${method} ${updateExpression.join(', ')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW',
    ConditionExpression: conditionExpression,
  };
};

const updateItemFormat = ({
  tableName,
  content,
  keyValue,
  keyName = 'id',
  conditionExpression,
}: IDynamoItemUpdate): Dynamo.DocumentClient.UpdateItemInput | null => {
  if (!keyValue) {
    return null;
  }

  const itemPlain = content instanceof Trackable ? classToPlain(content) : { ...content };
  // filter out all keys without a value or the primary key itself
  const existingData: [[string, any]?] = [];

  for (const [key, value] of Object.entries(itemPlain)) {
    if ((value && key !== keyName) || value === false) {
      existingData.push([key, value]);
    }
  }

  return existingData.length > 0
    ? buildUpdateQuery('set', tableName, existingData, keyValue, keyName, conditionExpression)
    : null; // nothing to update
};

const incrItemFormat = ({
  tableName,
  content,
  keyValue,
  keyName = 'id',
  conditionExpression,
}: IDynamoItemUpdate): Dynamo.DocumentClient.UpdateItemInput | null => {
  if (!keyValue) {
    return null;
  }

  return buildUpdateQuery(
    'add',
    tableName,
    Object.entries(content),
    keyValue,
    keyName,
    conditionExpression,
  );
};

export class DynamoService extends BaseService {
  static readonly compositeKeySeparator = '/';
  private readonly dynamo: Dynamo;
  private readonly client: Dynamo.DocumentClient;
  private readonly transactionMaxBatchSize: number = 10;
  private readonly batchWriteMaxBatchSize: number = 25;

  constructor() {
    super();

    this.debug('dynamoService.constructor');

    const credentials = (config.aws?.accessKeyId && config.aws?.secretAccessKey)
      ? {
          accessKeyId: config.aws.accessKeyId,
          secretAccessKey: config.aws.secretAccessKey,
        }
      : undefined;

    const aws: Dynamo.Types.ClientConfiguration = {
      credentials,
      dynamoDbCrc32: false,
      endpoint: config.aws?.dynamoEndpointUrl,
      region: config.aws?.region,
    };

    this.dynamo = new Dynamo(aws);

    this.client = new Dynamo.DocumentClient({
      service: this.dynamo,
      convertEmptyValues: true, // Sets empty things ('', []) to NULL
    });
  }

  /**
   * @description gets multiple items from a single or multiple tables by a primary key in one shot.
   *
   * Cli example
   * aws dynamodb batch-get-item --request-items '{ "Team": { "Keys": [{ "id": { "S": "1" } }, { "id": { "S": "2" } }] } }'
   *
   * Currently returns only 100 records under 16mb limit until the exponential backoff retry on UnprocessedKeys is implemented.
   */
  async batchGetItems(items: IDynamoGetItem[]): Promise<{ [tableName: string]: any[] }> {
    this.debug('DynamoService.batchGetItems', { itemsCount: items?.length });

    const requestItemsObject = {};

    for (const item of items) {
      requestItemsObject[item.tableName] = {
        Keys: item.keyValues.map(primaryKey => {
          const keyValueObject = {};
          keyValueObject[primaryKey.partitionKeyName] = primaryKey.partitionKeyValue;

          if (primaryKey.sortKeyName && primaryKey.sortKeyValue) {
            keyValueObject[primaryKey.sortKeyName] = primaryKey.sortKeyValue;
          }

          return keyValueObject;
        }),
      };
    }

    const params: Dynamo.DocumentClient.BatchGetItemInput = {
      RequestItems: requestItemsObject,
    };

    this.debug('Running the dynamo batchGet request', { params });

    const request = this.client.batchGet(params);

    this.setErrorHandler(request);

    const response = await request.promise();

    // TODO: if there are UnprocessedKeys in the response, request them with an exponential backoff
    // https://docs.aws.amazon.com/cli/latest/reference/dynamodb/batch-get-item.html

    return response.Responses || {};
  }

  /**
   * @description write all items in a batch.
   * Currently returns only 100 records under 16mb limit until the exponential backoff retry on UnprocessedKeys is implemented.
   */
  async batchWriteItems(items: IDynamoItemPut[]): Promise<boolean> {
    this.debug('DynamoService.batchWriteItems', { itemsCount: items?.length });

    const chunks = chunkify(items, this.batchWriteMaxBatchSize);

    for (const chunk of chunks) {
      const requestItemsObject = {};
      for (const item of chunk) {
        const writeRequests = requestItemsObject[item.tableName] || [];
        writeRequests.push({
          PutRequest: {
            Item: item.content,
          },
        });
        requestItemsObject[item.tableName] = writeRequests;
      }

      const params: Dynamo.DocumentClient.BatchWriteItemInput = {
        RequestItems: requestItemsObject,
      };

      this.debug('Running the dynamo batchWrite request', { params });

      const request = this.client.batchWrite(params);

      this.setErrorHandler(request);

      await request.promise();

      // TODO: if there are UnprocessedKeys in the response, write them with an exponential backoff
      // https://docs.aws.amazon.com/cli/latest/reference/dynamodb/batch-get-item.html
    }

    return true;
  }

  async transaction(items: (IDynamoTransactionItemPut | IDynamoTransactionItemUpdate)[]): Promise<boolean> {
    this.debug('DynamoService.transaction', { items });

    let transactItems: any[] = [];

    // loop through the items and then run a transaction
    for (const item of items) {
      let dynamoRequest: any;
      let method: string = 'Update';

      if (item.method === DynamoTransactionType.put) {
        dynamoRequest = putItemFormat(item);
        method = 'Put';
      } else if (item.method === DynamoTransactionType.increment) {
        dynamoRequest = incrItemFormat(item);
      } else {
        dynamoRequest = updateItemFormat(item);
      }

      if (dynamoRequest) {
        transactItems.push({ [method]: dynamoRequest });
      }

      if (transactItems.length >= this.transactionMaxBatchSize) {
        const params: Dynamo.DocumentClient.TransactWriteItemsInput = {
          TransactItems: transactItems,
        };

        this.debug('Running the dynamo transactWrite request', JSON.stringify({ params }, null, 2));

        const request = this.client.transactWrite(params);

        this.setErrorHandler(request);
        await request.promise();
        transactItems = [];
      }
    }

    // run remainder transaction
    if (transactItems.length) {
      const params: Dynamo.DocumentClient.TransactWriteItemsInput = {
        TransactItems: transactItems,
      };

      this.debug('Running the dynamo transactWrite request', JSON.stringify({ params }, null, 2));

      const request = this.client.transactWrite(params);

      this.setErrorHandler(request);
      await request.promise();
      transactItems = [];
    }

    return true;
  }

  /**
   * @description put the item into DynamoDB. If the index key exists there it would change the previous value.
   * @param {string} tableName the name of the table.
   * @param {any} item the item to put.
   */
  async putItem(tableName: string, item: any): Promise<boolean> {
    this.debug('DynamoService.putItem', { tableName, item });

    const params: Dynamo.DocumentClient.PutItemInput = putItemFormat({ tableName, content: item });

    this.debug('Running the dynamo put request', { params });

    const request = this.client.put(params);

    this.setErrorHandler(request);

    await request.promise();

    return true;
  }

  /**
   * @description updates the existing item.
   * @param tableName the name of the table to update the item in.
   * @param item the item itself.
   * @param keyValue the value of the primary key for the item.
   * @param keyName the name of the key. 'id' by default.
   */
  async updateItem(tableName: string, item: any, keyValue: string, keyName: string = 'id'): Promise<any> {
    this.debug('DynamoService.updateItem', { tableName, item, keyValue, keyName });

    const params: Dynamo.DocumentClient.UpdateItemInput | null = updateItemFormat({ tableName, content: item, keyValue, keyName });

    if (params === null) {
      this.warning('The item is empty, nothing to update');
      return null;
    }

    this.debug('Running the dynamo update request', { params });

    // make the request
    const request = this.client.update(params);

    this.setErrorHandler(request);

    // wait for result
    const response = await request.promise();

    return response.Attributes;
  }

  /**
   * @description get the item from DynamoDB by the primary key.
   * @param {string} tableName the name of the table to get the records from.
   * @param keyValue the value of the primary key.
   * @param keyName the name of the primary key.
   * @param sortKeyValue the value of the sort key.
   * @param sortKeyName the name of the sort key.
   */
  async getByPrimaryKey(
    tableName: string,
    keyValue: string,
    keyName: string = 'id',
    sortKeyValue?: string,
    sortKeyName?: string,
  ): Promise<any> {
    this.debug('DynamoService.getByPrimaryKey', { tableName, keyValue, keyName, sortKeyValue, sortKeyName });

    if (!keyValue) {
      return undefined;
    }

    const key = { [keyName]: keyValue };

    // add an optional sort key
    if (sortKeyName && sortKeyValue) {
      key[sortKeyName] = sortKeyValue;
    }

    const params: Dynamo.DocumentClient.GetItemInput = {
      TableName: tableName,
      Key: key,
    };

    this.debug('Running the dynamo get request', { params });

    // make the request
    const request = this.client.get(params);

    this.setErrorHandler(request);

    // wait for result
    const response = await request.promise();

    return response.Item;
  }

  /**
   * @description queries the items by index.
   * @param {string} tableName the table to query.
   * @param {string} indexValue index value.
   * @param {IDynamoIndex} index
   * @param index.indexAttribute .
   * @param index.indexName the name of the index.
   * @param filter an optional filter object.
   * @param exclusiveStartKey an optional start key to look up the next page.
   *
   * Represents a similar mapping template payload.
   *
   * {
   *   "version": "2017-02-28",
   *   "operation": "PutItem",
   *   "key": {
   *     "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id)
   *   },
   *   "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
   *   "condition": {
   *     "expression": "(attribute_not_exists(#identity) AND attribute_not_exists(#id))",
   *     "expressionNames": {
   *       "#identity": "identity",
   *       "#id": "id"
   *     }
   *   }
   * }
   */
  async queryByIndex(
    tableName: string,
    indexValue: string,
    index: IDynamoIndex,
    filter?: IDynamoFilter,
    exclusiveStartKey?: string,
  ): Promise<IPaginatedResult<any>> {
    this.debug('DynamoService.queryByIndex', { tableName, indexValue, index, filter, exclusiveStartKey });

    // add the index name to expression attribute names
    const ExpressionAttributeNames = { [`#${index.indexName}`]: index.indexAttribute };
    const ExpressionAttributeValues = { ':indexValue': indexValue };

    // add filter params
    if (filter) {
      Object.assign(ExpressionAttributeNames, filter.additionalKeys);
      Object.assign(ExpressionAttributeValues, filter.additionalValues);
    }

    const params: Dynamo.DocumentClient.QueryInput = {
      TableName: tableName,
      IndexName: index.indexName,
      KeyConditionExpression: `#${index.indexName} = :indexValue`,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      FilterExpression: filter ? filter.filterExpression : undefined,
    };

    this.debug('Querying Dynamo with params', { params });

    const request = this.client.query(params);

    // parse out the errors if the request turns out bad.
    this.setErrorHandler(request);

    // send the request
    const result = await request.promise();

    // parse the response
    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;
    const results = (!positiveCount && !hasItems) ? [] : result.Items as any[];

    return { items: results, nextToken: result.LastEvaluatedKey };
  }

  /**
   * NB: This method needs to be refactored with dynamo `query` method except `scan`
   *    `scan` is the most costly method in dynamo and it's better to avoid this call.
   * @description query data for searching like contains strings per keys
   * @param tableName - Table name
   * @param query - Object in which keys are names what search is wants to have by and values are what the search should be done by
   * @example
   *  If you want to search all data with `test` string in the `name` key you can call like
   *  `queryData(tableName, { name: 'test' });`
   *  This call return the data where the name attribute would be equal `One test`, `test two` `tttestkkk`
   */
  async queryData(tableName: string, query): Promise<IPaginatedResult<any>> {
    this.debug('DynamoService.queryData', { tableName, query });

    let params: Dynamo.DocumentClient.QueryInput = {
      TableName: tableName,
    };

    const entries = Object.entries(query);

    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    const filter: string[] = [];

    if (entries.length > 0) {
      for (const [key, value] of Object.entries(query)) {
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = value;
        filter.push(`contains(#${key}, :${key})`);
      }

      if (Object.keys(ExpressionAttributeValues).length && Object.keys(ExpressionAttributeNames).length) {
        params = {
          ...params,
          ExpressionAttributeValues,
          ExpressionAttributeNames,
          FilterExpression: filter.join(' and '),
        };
      }
    }

    this.debug('dynamoService.queryData query params', params);

    const request = this.client.scan(params);

    this.setErrorHandler(request);

    const result = await request.promise();

    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;
    const results = (!positiveCount && !hasItems) ? [] : result.Items as any[];

    return { items: results, nextToken: result.LastEvaluatedKey };
  }

  /**
   * @description queries the items by the primary key portion of a composite primary key.
   * @param tableName the table to query.
   * @param keyValue the value of the primary key portion of the composite index.
   * @param keyName the name of the primary key.
   */
  async queryByPrimaryKey(tableName: string, keyValue: string, keyName: string): Promise<any[]> {
    this.debug('DynamoService.queryByPrimaryKey', { tableName, keyValue, keyName });

    // put together expression attribute names to avoid naming collisions with DynamoDB reserved keywords

    const params: Dynamo.DocumentClient.QueryInput = {
      TableName: tableName,
      KeyConditionExpression: '#id = :keyValue',
      ExpressionAttributeNames: { '#id': keyName },
      ExpressionAttributeValues: { ':keyValue': keyValue },
    };

    this.debug('Querying Dynamo with params', { params });
    const request = this.client.query(params);

    // parse out the errors if the request turns out bad.
    this.setErrorHandler(request);

    // send the request
    const result = await request.promise();

    // parse the response
    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;

    return (!positiveCount && !hasItems) ? [] : result.Items as any[];
  }

  /**
   * @description queries the items by the userId, machineId and createdAt.
   * @param tableName the table to query.
   * @param machineId the value of the machine id.
   * @param userId the value the user id.
   * @param date the value the date.
   */
  async getNotificationHistory(tableName: string, machineId: string, userId: string, date: string) {
    this.debug('DynamoService.getNotificationHistory', { tableName, machineId, userId, date });

    const params = {
      TableName: tableName,
      FilterExpression: '#machineid=:machineid and #userid=:userid and #timestamp >= :date',
      ExpressionAttributeNames: {
        '#userid': 'userId',
        '#machineid': 'machineId',
        '#timestamp': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':machineid': machineId,
        ':userid': userId,
        ':date': date,
      },
    };

    this.debug('dynamoService.getNotificationHistory query params', params);

    const request = this.client.scan(params);
    this.setErrorHandler(request);
    const result = await request.promise();
    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;
    const results = (!positiveCount && !hasItems) ? [] : result.Items as any[];

    return { items: results };
  }

  /**
   * @description queries the items by status and date.
   * @param tableName the table to query.
   * @param status the value of the machine status.
   * @param date the value the created date.
   * @param updatedStatus the value the updated status.
   */

  async getRunningMachinesCreatedOneHourAgo(tableName: string, status: string, date: string, updatedStatus: string) {
    this.debug('DynamoService.getRunningMachinesCreatedOneHourAgo', { tableName, status, date, updatedStatus });

    const params = {
      TableName: tableName,
      FilterExpression: '#statuses=:status and #timestamp >= :from',
      ExpressionAttributeNames: {
        '#timestamp': 'createdAt',
        '#statuses': 'status',
      },
      ExpressionAttributeValues: {
        ':from': date,
        ':status': status,
      },
    };

    this.debug('dynamoService.getRunningMachinesCreatedOneHourAgo query params', params);

    const request = this.client.scan(params);
    this.setErrorHandler(request);
    const result = await request.promise();
    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;
    const results = (!positiveCount && !hasItems) ? [] : result.Items as any[];

    if (results.length > 0) {
      for (const key of results) {
        const updateParams = {
          TableName: tableName,
          Key: {
            id: key.id,
          },
          UpdateExpression: 'set #statuses = :status',
          ExpressionAttributeNames: {
            '#statuses': 'status',
          },
          ExpressionAttributeValues: {
            ':status': updatedStatus,
          },
          ReturnValues: 'UPDATED_NEW',
        };

        this.debug('dynamoService.getRunningMachinesCreatedOneHourAgo query updateParams', updateParams);

        await this.client.update(updateParams, (err, data) => {
          if (err) {
            console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
          }
        });
      }
    }
    return { items: results };
  }

  /**
   * @description queries the items by registrationToken and userId.
   * @param tableName the table to query.
   */

  async getExistingRegistrationTokens(tableName: string, token: any) {
    this.debug('DynamoService.getExistingRegistrationTokens', { tableName, token });

    const params = {
      TableName: tableName,
      FilterExpression: '#registrationToken=:registrationToken and #userId = :userId',
      ExpressionAttributeNames: {
        '#registrationToken': 'registrationToken',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':registrationToken': token.registrationToken,
        ':userId': token.userId,
      },
    };

    this.debug('dynamoService.getExistingRegistrationTokens query params', params);

    const request = this.client.scan(params);
    this.setErrorHandler(request);
    const result = await request.promise();
    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;
    const results = (!positiveCount && !hasItems) ? [] : result.Items as any[];

    return { items: results };
  }

  /**
   * @description queries the items by registrationToken and userId.
   * @param tableName the table to query.
   */

  async getRegistrationTokenIsActive(tableName: string, userId: any) {
    this.debug('DynamoService.getRegistrationTokenIsActive', { tableName, userId });

    const params = {
      TableName: tableName,
      FilterExpression: '#isActive=:isActive and #userId = :userId',
      ExpressionAttributeNames: {
        '#isActive': 'isActive',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':isActive': true,
        ':userId': userId,
      },
    };

    this.debug('dynamoService.getExistingRegistrationTokens query params', params);

    const request = this.client.scan(params);
    this.setErrorHandler(request);
    const result = await request.promise();
    const positiveCount = result.Count ? result.Count > 0 : false;
    const hasItems = result.Items ? result.Items.length > 0 : false;
    const results = (!positiveCount && !hasItems) ? [] : result.Items as any[];

    return { items: results };
  }

  /**
   * @description parse out the errors if the request returns with an error.
   * @param request the request to operate on.
   */
  private setErrorHandler(request) {
    request.on('extractError', async response => {
      let cancellationReasons: any[];

      try {
        const responseBody = response.httpResponse.body ? response.httpResponse.body.toString() : '';
        cancellationReasons = JSON.parse(responseBody.toString()).CancellationReasons;
        await this.error('Failed to save dynamo items in a transaction', { cancellationReasons, responseBody });
      } catch (error) {
        await this.error('Error extracting cancellation error', { error: error.message ? error.message : error });
      }
    });
  }
}
