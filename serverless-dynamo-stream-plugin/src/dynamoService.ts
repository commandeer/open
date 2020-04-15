import Dynamo from 'aws-sdk/clients/dynamodb';
import { DynamoStreamType, StreamSpecification, Table } from './types';

export class DynamoService {
  readonly client: Dynamo;

  constructor(client: Dynamo = new Dynamo()) {
    this.client = client;
  }

  async describeTable(name: string): Promise<Table | undefined> {

    try {
      const params: Dynamo.DescribeTableInput = {
        TableName: name,
      };

      const response = await this.client.describeTable(params).promise();
      return response.Table ? DynamoService.parseTableDescription(response.Table) : undefined;

    } catch (error) {
      throw error;
    }
  }

  async updateTable(name: string, stream: StreamSpecification): Promise<Table | undefined> {
    try {
      const params: Dynamo.UpdateTableInput = {
        TableName: name,
        StreamSpecification: stream.dynamoObject,
      };

      const response = await this.client.updateTable(params).promise();
      return response.TableDescription ? DynamoService.parseTableDescription(response.TableDescription) : undefined;

    } catch (error) {
      throw error;
    }
  }

  private static parseTableDescription(description: Dynamo.TableDescription): Table {
    const streamSpecification = description.StreamSpecification ? {
      isEnabled: description.StreamSpecification.StreamEnabled,
      viewType: description.StreamSpecification.StreamViewType
        ? description.StreamSpecification.StreamViewType as DynamoStreamType
        : undefined
    } : undefined;

    // return the table model
    return new Table({
      streamSpecification,
    });
  }
}
