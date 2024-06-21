import { ITrackable } from '../../types/ITrackable';
import { DebugLevel } from './DebugLevel';
import { LogType } from './LogType';

export interface ILog extends ITrackable {
  data?: any;
  level?: DebugLevel;
  title: string;
  type: LogType;
}
