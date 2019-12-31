import { Context, Handler } from 'aws-lambda';

interface Record {
  messageId: string;
  receiptHandle: string;
  body: string;
}

interface DynamoStreamEvent {
  Records: Record[];
}

/**
 * @description handle receiving a tank dynamo table stream
 * @param {DynamoStreamEvent} event event object containing one or more tanks
 * @param {Context} context context object
 * @returns {boolean} status
 */
const process: Handler = async (event: DynamoStreamEvent, context: Context) => {
  console.log('tankDynamoStreamEvent.process', { event, context });

  try {
    for (const record of event.Records) {
      const tank = JSON.parse(record.body);
      console.log(tank);
    }

    context.succeed(true);
  } catch (exception) {
    context.fail(exception);
  }
};

export { process };
