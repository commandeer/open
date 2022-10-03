import { Environment } from '@/config';
import { S3Service } from '@/_base/s3Service';
import { BaseService } from '@/_base/baseService';
//import ffmpeg from 'fluent-ffmpeg';

const environmentAbbreviation = Environment.toAbbreviation(Environment.currentEnvironment());
const prefixVideos = 'videos';
const prefixOutput = 'videos-watermark';

export class VideoWatermarkService extends BaseService {

  public static async processVideo(s3Record: any): Promise<boolean> {
    this.debug('VideoWatermarkService.processVideo', { s3Record });

    // Grab the filename and bucket name
    const bucket = s3Record.bucket.name;
    const outputBucket = `media-${environmentAbbreviation}`;
    const key = s3Record.object.key;
    const newKey = `${prefixOutput}/${key.substring(key.lastIndexOf('/') + 1)}`;

    // only do this for the videos
    if (!key.startsWith(prefixVideos)) {
      this.warning('exiting, this is not a /videos object');
      return false;
    }

    this.debug('processing video', { bucket, key, newKey });

     // Stream to read the file from the bucket
    const readStream = S3Service.readStreamFromS3(bucket, key);
 
    // Stream to resize the video
    const resizeStream = VideoWatermarkService.resize();

     // Stream to upload to the ouput bucket
     const { writeStream, upload } = S3Service.writeStreamToS3(outputBucket, newKey);
 
     // Trigger the streams
     // readStream.pipe(resizeStream).pipe(writeStream);
     readStream.pipe(writeStream);
 
     // Wait for the file to upload
     await upload;

    return true;
  }

  private static resize() {
    this.debug('VideoWatermarkService.resize');

    //return ffmpeg()
    //  .format('mp4');
  }

}
