import { Api, Function, StackContext, Topic } from '@serverless-stack/resources';
import * as logs from 'aws-cdk-lib/aws-logs';

export function stack({ stack }: StackContext) {

  // create the receiptHandler
  const receiptHandler = new Function(stack, 'receiptHandler', {
    handler: 'functions/orders/receiptHandler.handler',
    logRetention: logs.RetentionDays.INFINITE,
  });

  // create the shippingHandler
  const shippingHandler = new Function(stack, 'shippingHandler', {
    handler: 'functions/orders/shippingHandler.handler',
    logRetention: logs.RetentionDays.INFINITE,
  });

  // Create Topic
  const topic = new Topic(stack, 'Ordered', {
    subscribers: {
      receipt: receiptHandler,
      shipping: shippingHandler,
    },
  });

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        // Pass in the topic to our API
        environment: {
          topicArn: topic.topicArn,
        },
      },
    },
    routes: {
      'POST /order': 'functions/orders/orderHandler.handler',
    },
  });

  // Show the names in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    LambdaReceiptHandler: receiptHandler.functionName,
    LambdaShippingHandler: shippingHandler.functionName,
    TopicName: topic.topicName,
  });

}
