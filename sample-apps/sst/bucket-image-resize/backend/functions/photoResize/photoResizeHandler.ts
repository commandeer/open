import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { LoggerService } from 'functions/_base/logger';
import { PhotoResizeService } from './photoResizeService';

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  LoggerService.debug('photoResizeHandler.handler called');

  const batchCount = 5;
  let i = 1;
  let operations: any[] = [];
  for (const record of event.Records) {
    const s3Record = record.s3;
    LoggerService.debug('loading', { s3Record });

    operations.push(PhotoResizeService.processImage(s3Record));

    if (operations.length === batchCount) {
      LoggerService.debug('processing batch', { i });
      await Promise.all(operations);
      operations = [];
      i += 1;
    }
  }

  // process any remainder
  if (operations.length > 0) {
    LoggerService.debug('processing batch', { i });
    await Promise.all(operations);
  }

  return true;
};
