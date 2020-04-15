import Dynamo from 'aws-sdk/clients/dynamodb';
import { DynamoStreamType } from './types';

export interface IStreamSpecification {
  isEnabled: boolean;
  viewType: DynamoStreamType;
}

export interface ITable {
  streamSpecification?: IStreamSpecification;
}

export class Table implements ITable {
  streamSpecification?: IStreamSpecification;

  constructor(table: ITable) {
    if (table.streamSpecification) {
      this.streamSpecification = table.streamSpecification;
    }
  }
}

export class DynamoService {
  readonly client: Dynamo;

  constructor(client: Dynamo = new Dynamo()) {
    this.client = client;
  }

  async describeTable(name: string): Promise<Table | undefined> {
    const params: Dynamo.DescribeTableInput = {
      TableName: name,
    };

    try {
      const response = await this.client.describeTable(params).promise();

      // if there is no table coming back, return undefined
      if (!response.Table) {
        return undefined;
      }

      // otherwise, parse a table into an internal type
      const table = response.Table;
      return new Table({
        streamSpecification: table.StreamSpecification
          ? {
            isEnabled: table.StreamSpecification.StreamEnabled,
            viewType: table.StreamSpecification.StreamViewType ? table.StreamSpecification.StreamViewType as DynamoStreamType : undefined
          }
          : undefined
      });
    } catch (error) {
      throw error;
    }
  }
}
