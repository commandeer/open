import { EnvironmentAbbreviation } from './EnvironmentAbbreviation';

/**
 * Contains all available environments.
 */
// eslint-disable-next-line import/export
export enum Environment {
  DEVELOPMENT = 'dev',
  LOCAL = 'local',
  PRODUCTION = 'prd',
  STAGING = 'stg',
  TEST = 'test'
}

/**
 * Merges some helper methods into Environment for some syntactic sugar
 */
// eslint-disable-next-line no-redeclare,import/export
export namespace Environment {

  export function currentEnvironment(): Environment {
    // if current environment is not set, set it to development
    if (!process.env.VIDEO_ENV) {
      process.env.VIDEO_ENV = 'dev';
      // throw new Error(`VIDEO_ENV is not set, please specify the environment you would like to run in.`)
    }

    return process.env.VIDEO_ENV as Environment;
  }

  /**
   * Returns true if the current environment is development, false otherwise.
   */
  export function isDevelopment(): boolean {
    return process.env.VIDEO_ENV === Environment.DEVELOPMENT.toString();
  }

  /**
   * Returns true if the current environment is staging, false otherwise.
   */
  export function isStaging(): boolean {
    return process.env.VIDEO_ENV === Environment.STAGING.toString();
  }

  /**
   * Returns true if the current environment is production, false otherwise.
   */
  export function isProduction(): boolean {
    return process.env.VIDEO_ENV === Environment.PRODUCTION.toString();
  }

  /**
   * Returns true if the current environment is test, false otherwise.
   */
  export function isTest(): boolean {
    return process.env.VIDEO_ENV === Environment.TEST.toString();
  }

  /**
   * Returns true if the current environment is local, false otherwise.
   */
  export function isLocal(): boolean {
    return process.env.VIDEO_ENV === Environment.LOCAL.toString();
  }

  export function toAbbreviation(environment: Environment): string {
    switch (environment) {
      case Environment.DEVELOPMENT: return EnvironmentAbbreviation.DEV;
      case Environment.PRODUCTION: return EnvironmentAbbreviation.PRD;
      case Environment.STAGING: return EnvironmentAbbreviation.STG;
      case Environment.LOCAL: return EnvironmentAbbreviation.LCL;
      default: return EnvironmentAbbreviation.LCL;
    }
  }

}
