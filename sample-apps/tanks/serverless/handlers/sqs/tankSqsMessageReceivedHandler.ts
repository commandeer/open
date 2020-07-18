import { Context, Handler } from 'aws-lambda';

interface Record {
  messageId: string;
  receiptHandle: string;
  body: string;
}

interface SqsEvent {
  Records: Record[];
}

interface ITankMessage {
  id: string;
}

/**
 * @description handle receiving a tank TANK_CREATED sqs message
 * @param {SqsEvent} event event object containing one or more tank messages
 * @param {Context} context context object
 * @returns {boolean} status
 */
const process: Handler = async (event: SqsEvent, context: Context) => {
  console.log('tankSqsMessageReceivedEvent.handleMessage', { event, context });

  try {
    for (const record of event.Records) {
      const tankMessage = JSON.parse(record.body) as ITankMessage;
      console.log(tankMessage);
    }

    context.succeed(true);
  } catch (exception) {
    context.fail(exception);
  }
};

export { process };
