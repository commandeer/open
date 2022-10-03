export interface IConfigAws {
  accessKeyId: string;
  region: string;
  secretAccessKey: string;

  dynamoEndpointUrl?: string;
  s3EndpointUrl?: string;
}
