import { ITrackable } from '@/_base/ITrackable';
import { Environment } from './Environment';

export interface IConfig extends ITrackable {
  environment: Environment; // currently DEVELOPMENT, PRODUCTION
}
