import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import AWS from 'aws-sdk';
import { LoggerService } from 'functions/_base/logger';

const sns = new AWS.SNS();

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  LoggerService.debug('orderHandler.handler called');

  // Publish a message to topic
  await sns
    .publish({
      // Get the topic from the environment variable
      TopicArn: process.env.topicArn,
      Message: JSON.stringify({ ordered: true }),
      MessageStructure: 'string',
    })
    .promise();

  LoggerService.info('Order confirmed!');

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'successful' }),
  };

  return true;
};
