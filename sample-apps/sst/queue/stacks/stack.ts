import { Api, Function, Queue, StackContext } from '@serverless-stack/resources';
import * as logs from 'aws-cdk-lib/aws-logs';

export function stack({ stack }: StackContext) {

  // create the consumerHandler
  const consumerHandler = new Function(stack, 'consumerHandler', {
    handler: 'functions/consumer/consumerHandler.handler',
    logRetention: logs.RetentionDays.INFINITE,
  });

  // Create Queue
  const queue = new Queue(stack, 'Queue', {
    consumer: consumerHandler,
  });

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        // Pass in the queue to our API
        environment: {
          queueUrl: queue.queueUrl,
        },
      },
    },
    routes: {
      'POST /': 'functions/consumer/consumerApiHandler.handler',
    },
  });

  // Show the names in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    LambdaConsumerHandler: consumerHandler.functionName,
    QueueName: queue.queueName,
  });

}
