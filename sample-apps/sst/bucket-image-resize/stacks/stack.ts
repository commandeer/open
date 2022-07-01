import { Bucket, Function, StackContext } from '@serverless-stack/resources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';

export function stack({ stack }: StackContext) {

  // create the photoResizeHandler
  const photoResizeHandler = new Function(stack, 'photoResizeHandler', {
    handler: 'functions/photoResize/photoResizeHandler.handler',
    bundle: {
      externalModules: ['sharp'],
    },
    layers: [
      new lambda.LayerVersion(stack, 'SharpLayer', {
        code: lambda.Code.fromAsset('layers/sharp'),
      }),
    ],
    logRetention: logs.RetentionDays.INFINITE,
  });

  // add permissions to allow it to write to s3
  photoResizeHandler.attachPermissions(["s3"]);

  // Create a new bucket to add items to, and make the resize
  // of photos fire anytime an item is written to the photos
  const mediaInputBucket = new Bucket(stack, 'mediaInputBucket', {
    notifications: {
      resizePhotos: {
        function: photoResizeHandler,
        events: ['object_created'],
        filters: [{ prefix: 'photos' }],
      },
    },
  });

  // Allow the notification functions to access the bucket
  mediaInputBucket.attachPermissions([mediaInputBucket]);

  // Show the names in the output
  stack.addOutputs({
    MediaInputBucketName: mediaInputBucket.bucketName,
    PhotoResizeFunctionName: photoResizeHandler.functionName,
  });

}
