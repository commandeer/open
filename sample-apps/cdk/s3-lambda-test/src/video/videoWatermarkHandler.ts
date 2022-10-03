import { LoggerService } from '@/_base/logger';
import { S3Event} from 'aws-lambda';
import { VideoWatermarkService } from './videoWatermarkService';

export async function main(event: S3Event): Promise<boolean> {
  LoggerService.debug('videoWatermarkHandler.main called');

  for (const record of event.Records) {
    const s3Record = record.s3;
    LoggerService.debug('loading', { s3Record });

    await VideoWatermarkService.processVideo(s3Record);
  }

  return true;
}
