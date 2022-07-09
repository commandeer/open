import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoggerService } from 'functions/_base/logger';

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  LoggerService.debug('consumerrHandler.handler called');

  LoggerService.info('Message processed!', event);

  return {};
};
