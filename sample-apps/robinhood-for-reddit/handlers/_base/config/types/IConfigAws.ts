import { ITrackable } from '@/handlers/_base/services/types/ITrackable';

export interface IConfigAws extends ITrackable {
  accessKeyId: string;
  region: string;
  secretAccessKey: string;

  athenaEndpoint?: string;
  dynamoEndpointUrl?: string;
  iotEndpointUrl?: string;
  s3EndpointUrl?: string;
}
