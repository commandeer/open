import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';

import { BaseService } from '@/handlers/_base/services/baseService';
import { ConfigApi } from '@/handlers/_base/config';

const config = ConfigApi.loadByEnvironment();

export interface IS3Object {
  body?: string;
  name: string;
  bucketName?: string; // The name of the bucket the item is in
  contentLength?: number; // Size of the body in bytes
  contentType?: string; // A standard MIME type describing the format of the object data.
  encoding?: string; // Content encoding
  metadata?: {[key: string]: string}; // A map of metadata to store with the object in S3.
  lastModified?: Date;
}

export class S3Service extends BaseService {
  private readonly _client: S3;

  constructor() {
    super();
    this.debug('s3Service.contructor');

    const credentials = (config.aws?.accessKeyId && config.aws?.secretAccessKey)
      ? {
          accessKeyId: config.aws.accessKeyId,
          secretAccessKey: config.aws.secretAccessKey,
        }
      : undefined;

    const aws: S3.ClientConfiguration = {
      credentials,
      endpoint: config.aws?.s3EndpointUrl,
      region: config.aws?.region,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    };

    this._client = new S3(aws);
  }

  /**
   * @description saves an object to an S3 bucket.
   * @param {string} bucket - name of the bucket
   * @param {string} key - key for the save operation
   * @param {any} body - object to save
   * @returns Promise<any>
   * @memberof S3Service
   */
  public async save(bucket: string, key: string, body: any): Promise<any> {
    this.debug('s3Service.save', { bucket, key });

    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: body,
    };

    return await this._client.putObject(params).promise();
  }

  /**
   * @description Saves an object to an S3 bucket with encryption
   * @param {string} bucket - name of the bucket
   * @param {string} key - key for the save operation
   * @param {any} body - object to save
   * @param {string} sseKeyId SSEKMSKeyId key
   * @returns Promise<any>
   * @memberof S3Service
   */
  async saveWithEncryption(bucket: string, key: string, body: any, sseKeyId?: string): Promise<any> {
    this.debug('s3Service.saveWithEncryption', { bucket, key, body });

    const params: PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ServerSideEncryption: 'aws:kms', // "AES256"|"aws:kms"|string;
    };

    if (sseKeyId) {
      params.SSEKMSKeyId = sseKeyId;
    }

    try {
      await this._client.putObject(params).promise();
    } catch (ex) {
      this.error('error saving', ex);
    }
  }

  async getObject(bucket: string, key: string): Promise<IS3Object> {
    this.debug('s3Service.getObject', { bucket, key });

    try {
      const params: GetObjectRequest = {
        Bucket: bucket,
        Key: key,
      };

      const rawObject = await this._client.getObject(params).promise();

      return {
        name: key,
        body: rawObject.Body ? rawObject.Body.toString() : undefined,
        contentType: rawObject.ContentType,
        metadata: rawObject.Metadata,
        encoding: rawObject.ContentEncoding,
        lastModified: rawObject.LastModified,
        contentLength: rawObject.ContentLength,
      };
    } catch (error) {
      this.error('Failed to get an object from S3', { error: error.message ? error.message : error });
      throw error;
    }
  }
}
