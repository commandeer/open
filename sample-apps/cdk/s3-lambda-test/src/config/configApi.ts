import { Config, Environment } from '@/config';
import { LoggerService } from '@/_base/logger/loggerService';
import {
  IConfigApi,
  IConfigAws,
} from '@/config/types';

const configSample: IConfigApi = {

  aws: {
    accessKeyId: '1',
    region: 'us-east-1',
    secretAccessKey: '1'
  },

  environment: Environment.DEVELOPMENT,

  useConfigFile: false,

};

export class ConfigApi extends Config implements IConfigApi {

  aws?: IConfigAws;
  environment: Environment;
  useConfigFile: boolean;

  constructor(config: IConfigApi = configSample) {
    super(config);

    this.aws = config.aws;
    this.useConfigFile = config.useConfigFile;
  }

  static loadByEnvironment(environment: Environment = Environment.currentEnvironment()): ConfigApi {
    try {
      LoggerService.debug('ConfigApi.loadByEnvironment', environment);

      const abbreviation = Environment.toAbbreviation(environment);
      const configClient = require(`./configInfrastructure-${abbreviation}.json`);

      return new ConfigApi(configClient);
    } catch (ex) {
      LoggerService.error('- error getting configuration file', { ex });
      throw ex;
    }
  }

  static fromEnvironmentVariables(environment: Environment = Environment.currentEnvironment()): ConfigApi {
    LoggerService.debug('ConfigApi.fromEnvironmentVariables', environment);

    // get environment variables

    // check if the use config file override is in place
    const useConfigFile = process.env.USE_CONFIG_FILE;

    if (useConfigFile) {
      LoggerService.info('ConfigApi.fromEnvironmentVariables - using config file');
      return this.loadByEnvironment(environment);
    }

    // return the config object
    return new ConfigApi({
      environment,
      useConfigFile: true,
    });
  }
}
