import { IStreamSpecification } from './IStreamSpecification';
import { DynamoStreamType } from './DynamoStreamType';
import Dynamo from 'aws-sdk/clients/dynamodb';

export class StreamSpecification implements IStreamSpecification {
  isEnabled: boolean;
  viewType?: DynamoStreamType;

  constructor(stream: IStreamSpecification) {
    this.isEnabled = stream.isEnabled;

    if (stream.viewType) {
      this.viewType = stream.viewType;
    }
  }

  get dynamoObject(): Dynamo.StreamSpecification {
    return {
      StreamEnabled: this.isEnabled,
      StreamViewType: this.viewType,
    }
  }
}
