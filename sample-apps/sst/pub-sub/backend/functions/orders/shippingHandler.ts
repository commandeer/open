import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoggerService } from 'functions/_base/logger';

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  LoggerService.debug('shippingHandler.handler called');

  LoggerService.info('Item shipped!');

  return true;
};
