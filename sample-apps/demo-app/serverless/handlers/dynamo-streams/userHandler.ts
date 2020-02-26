import { Context, Handler } from 'aws-lambda';

export enum EventName {
  INSERT = 'INSERT',
  MODIFY = 'MODIFY',
};

export interface EventUser {
  Records: any[]
};

/**
 * @description process a user when it is saved to dynamo - sends out an email
 * @param {any} event user record from dynamo
 * @param {Context} context context object
 * @returns void
 */
const process: Handler = async (event: EventUser, context: Context) => {
  try {
    console.log(event);
    console.log(context);

    // loop through the items inserted into the database
    for (const item of event.Records) {
      console.log(item.eventName);
      console.log(JSON.stringify(item.dynamodb));

      switch (item.eventName) {
        case EventName.INSERT:
          const email = item.dynamodb.NewImage.email.S;
          let firstName = item.dynamodb.NewImage.firstName.S;


        case EventName.MODIFY:
          break;
      }
    }

    context.succeed(true);
  } catch (exception) {
    console.error(exception);
    context.succeed(false);
  }
};

export { process };
