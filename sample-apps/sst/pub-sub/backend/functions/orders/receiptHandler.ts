import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoggerService } from 'functions/_base/logger';

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  LoggerService.debug('receiptHandler.handler called');

  LoggerService.info('Receipt sent!');

  return true;
};
