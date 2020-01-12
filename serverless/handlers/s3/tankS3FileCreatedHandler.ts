import { Context, Handler, S3CreateEvent } from 'aws-lambda';

/**
 * @description handle receiving a tank file from s3
 * @param {S3CreateEvent} event event object
 * @param {Context} context context object
 * @returns {boolean} status
 */
const process: Handler = async (event: S3CreateEvent, context: Context) => {
  console.log('tankS3FileCreatedEvent.handleFile', { event, context });

  try {
    const fileName: string = decodeURIComponent(event.Records[0].s3.object.key);
    console.log(fileName);

    context.succeed(true);
  } catch (exception) {
    context.fail(exception);
  }
};

export { process };
