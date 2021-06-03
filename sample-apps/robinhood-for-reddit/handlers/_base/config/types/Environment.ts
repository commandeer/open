import { EnvironmentAbbreviation } from './EnvironmentAbbreviation';

/**
 * Contains all available environments.
 */
export enum Environment {
  DEVELOPMENT = 'dev',
  STAGING = 'stg',
  PRODUCTION = 'prd',
  TEST = 'test',
  LOCAL = 'local',
}

/**
 * Merges some helper methods into Environment for some syntactic sugar
 */
// eslint-disable-next-line no-redeclare
export namespace Environment {

  export function currentEnvironment(): Environment {
    // if current environment is not set, set it to development
    if (!process.env.TMB_ENV) {
      process.env.TMB_ENV = 'dev';
      // throw new Error(`TMB_ENV is not set, please specify the environment you would like to run in.`)
    }

    return process.env.TMB_ENV as Environment;
  }

  /**
   * Returns true if the current environment is development, false otherwise.
   */
  // eslint-disable-next-line no-inner-declarations
  export function isDevelopment(): boolean {
    return process.env.TMB_ENV === Environment.DEVELOPMENT.toString();
  }

  /**
   * Returns true if the current environment is staging, false otherwise.
   */
  // eslint-disable-next-line no-inner-declarations
  export function isStaging(): boolean {
    return process.env.TMB_ENV === Environment.STAGING.toString();
  }

  /**
   * Returns true is the current environment is production, false otherwise.
   */
  // eslint-disable-next-line no-inner-declarations
  export function isProduction(): boolean {
    return process.env.TMB_ENV === Environment.PRODUCTION.toString();
  }

  /**
   * Returns true is the current environment is test, false otherwise.
   */
  // eslint-disable-next-line no-inner-declarations
  export function isTest(): boolean {
    return process.env.TMB_ENV === Environment.TEST.toString();
  }

  /**
   * Returns true is the current environment is local, false otherwise.
   */
  // eslint-disable-next-line no-inner-declarations
  export function isLocal(): boolean {
    return process.env.TMB_ENV === Environment.LOCAL.toString();
  }

  export function toAbbreviation(environment: Environment): string {
    switch (environment) {
      case Environment.DEVELOPMENT: return EnvironmentAbbreviation.DEV;
      case Environment.PRODUCTION: return EnvironmentAbbreviation.PRD;
      case Environment.STAGING: return EnvironmentAbbreviation.STG;
      case Environment.LOCAL: return EnvironmentAbbreviation.LCL;
      default: return EnvironmentAbbreviation.TST;
    }
  }

}
