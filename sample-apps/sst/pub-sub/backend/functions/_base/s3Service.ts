import AWS from 'aws-sdk';
import { BaseService } from './baseService';
import stream from 'stream';

const S3 = new AWS.S3();

export class S3Service extends BaseService {

  public static readStreamFromS3(bucket: string, key: string) {
    this.debug('S3Service.readStreamFromS3', { bucket, key });

    return S3.getObject({
      Bucket: bucket,
      Key: key,
    }).createReadStream();
  }

  public static writeStreamToS3(bucket: string, key: string) {
    this.debug('S3Service.writeStreamToS3', { bucket, key });

    const pass = new stream.PassThrough();

    return {
      writeStream: pass,
      upload: S3.upload({
        Key: key,
        Bucket: bucket,
        Body: pass,
      }).promise(),
    };
  }

}