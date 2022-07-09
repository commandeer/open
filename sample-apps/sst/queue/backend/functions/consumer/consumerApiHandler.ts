import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoggerService } from 'functions/_base/logger';
import AWS from 'aws-sdk';

const sqs = new AWS.SQS();

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  LoggerService.debug('consumerApiHandler.handler called');

  // Send a message to queue
  await sqs.sendMessage({
    // Get the queue url from the environment variable
    QueueUrl: process.env.queueUrl as string,
    MessageBody: JSON.stringify({ ordered: true }),
  }).promise();

  LoggerService.debug('Message queued!');

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
};
