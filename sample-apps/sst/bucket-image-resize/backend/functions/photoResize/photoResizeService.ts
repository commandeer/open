import { S3Service } from 'functions/_base/s3Service';
import { BaseService } from 'functions/_base/baseService';
import sharp from 'sharp';

const width = 800;
const prefixPhotos = 'photos';
const prefixOutput = 'resized-photos';

export class PhotoResizeService extends BaseService {

  public static async processImage(s3Record: any): Promise<boolean> {
    this.debug('PhotoResizeService.processImage', { s3Record });

    // Grab the filename and bucket name
    const bucket = s3Record.bucket.name;
    const key = s3Record.object.key;
    const newKey = `${prefixOutput}/${key.substring(key.lastIndexOf('/') + 1)}`;

    // only do this for the photos bucket
    if (!key.startsWith(prefixPhotos)) {
      this.warning('exiting, this is not a /photos object');
      return false;
    }

    this.debug('processing image', { bucket, key, newKey });

    // Stream to read the file from the bucket
    const readStream = S3Service.readStreamFromS3(bucket, key);

    // Stream to resize the image
    const resizeStream = PhotoResizeService.resize(width);

    // Stream to upload to the bucket
    const { writeStream, upload } = S3Service.writeStreamToS3(bucket, newKey);

    // Trigger the streams
    readStream.pipe(resizeStream).pipe(writeStream);

    // Wait for the file to upload
    await upload;

    return true;
  }

  private static resize(width: number) {
    this.debug('PhotoResizeService.resize', { width });

    return sharp()
      .resize(width);
  }
}