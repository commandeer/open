import { Environment } from '@/handlers/_base/config';
import { LoggerService } from '@/handlers/_base/services/logger/loggerService';
import {
  IConfigApi,
  IConfigAthena,
  IConfigAws,
} from '@/handlers/_base/config/types';
import { Config } from '@/handlers/_base/config/types/config';

const configSample: IConfigApi = {

  athena: {
    databaseName: 'tumble',
    s3OutputLocation: 's3://BUCKET_NAME',
  },

  aws: {
    accessKeyId: '1',
    dynamoEndpointUrl: 'http://localhost:4566',
    iotEndpointUrl: '-',
    region: 'us-east-1',
    secretAccessKey: '1',
    s3EndpointUrl: 'http://localhost:4566',
  },

  environment: Environment.DEVELOPMENT,

};

export class ConfigApi extends Config implements IConfigApi {
  athena: IConfigAthena;
  aws: IConfigAws;
  environment: Environment;

  public constructor(config: IConfigApi = configSample) {
    super(config);

    this.athena = config.athena || configSample.athena;
    this.aws = config.aws || configSample.aws;
    this.environment = config.environment || configSample.environment;
  }

  public static loadByEnvironment(environment: Environment = Environment.currentEnvironment()): ConfigApi {
    try {
      LoggerService.debug('ConfigApi.loadByEnvironment', environment);

      const configClient = require(`./configInfrastructure-${environment}.json`);

      return new ConfigApi(configClient);
    } catch (ex) {
      LoggerService.error('- error getting configuration file', { ex });
      throw ex;
    }
  }
}
