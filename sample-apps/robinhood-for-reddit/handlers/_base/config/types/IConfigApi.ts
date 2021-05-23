import {
  Environment,
  IConfig,
  IConfigAthena,
  IConfigAws,
} from '.';

export interface IConfigApi extends IConfig {
  athena: IConfigAthena;
  aws: IConfigAws;
  environment: Environment;
}
