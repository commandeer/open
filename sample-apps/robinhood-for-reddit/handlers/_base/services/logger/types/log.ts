import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ILog } from './ILog';
import { DebugLevel } from './DebugLevel';
import { LogType } from './LogType';

export class Log implements ILog {
  public createdAt?: Date | string;
  public data?: any;
  public id?: string;
  public level?: DebugLevel;
  public title: string;
  public type: LogType;

  public constructor(log: ILog) {
    this.id = (log.id) ? log.id : uuid();

    this.createdAt = log.createdAt ? log.createdAt : moment().toDate();
    this.data = log.data;
    this.level = log.level;
    this.title = log.title;
    this.type = log.type;
  }
}
