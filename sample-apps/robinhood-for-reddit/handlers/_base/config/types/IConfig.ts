import { ITrackable } from '@/handlers/_base/services/types/ITrackable';
import { Environment } from './Environment';

export interface IConfig extends ITrackable {
  environment: Environment; // currently DEVELOPMENT, PRODUCTION
}
