import { v4 as uuid } from 'uuid';
import { Environment } from './Environment';
import { IConfig } from './IConfig';

const configSample: IConfig = {
  id: 'GUID',
  environment: Environment.DEVELOPMENT,
};

export class Config implements IConfig {

  public id?: string;
  public environment: Environment;

  public constructor(config: IConfig = configSample) {
    this.id = (config.id)
      ? config.id
      : uuid();

    this.environment = config.environment;
  }

  public get isDevelopment(): boolean {
    return this.environment.toLowerCase() === Environment.DEVELOPMENT;
  }

  public get isLocal(): boolean {
    return this.environment.toLowerCase() === Environment.LOCAL;
  }

  public get isStaging(): boolean {
    return this.environment.toLowerCase() === Environment.STAGING;
  }

  public get isProduction(): boolean {
    return this.environment.toLowerCase() === Environment.PRODUCTION;
  }

  public static isDevelopment(environment: Environment): boolean {
    return environment.toLowerCase() === Environment.DEVELOPMENT;
  }

  public static isStaging(environment: Environment): boolean {
    return environment.toLowerCase() === Environment.STAGING;
  }

  public static isProduction(environment: Environment): boolean {
    return environment.toLowerCase() === Environment.PRODUCTION;
  }
}
