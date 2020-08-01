import { Context, Handler } from 'aws-lambda';

/**
 * @description handle some tank payload
 * @param event event object
 * @param context context object
 */
const process: Handler = async (event: any, context: Context) => {
  console.log('tankHandler.process', { event });

  try {
    const shot = {
      message: 'Boom! 💥',
      event,
    };
    context.succeed(shot);
  } catch (exception) {
    context.fail(exception);
  }
};

export { process };
