import {
  Environment,
  IConfig,
  IConfigAws,
} from '.';

export interface IConfigApi extends IConfig {

  aws?: IConfigAws;
  environment: Environment;
  useConfigFile: boolean;

}
