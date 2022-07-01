import CircularJson from 'circular-json';
import { DebugLevel, Log, LogType } from './types';

export { DebugLevel };

export class LoggerService {
  // set the debug logs if VERBOSE environment variable is present

  static areDebugLogsOn: boolean = !!((process.env.VERBOSE && process.env.VERBOSE === 'true'));
  static logs: any[] = [];

  /**
   * @description debug log
   * @param title the title of the log message.
   * @param data optional data object to print out.
   * @memberof LoggerService
   */
  public async debug(title: string, data: string | object | [] = {}): Promise<boolean> {
    return await LoggerService.debug(title, data);
  }

  /**
   * @description error log
   * @param title the title of the log message
   * @param data optional data
   * @memberof LoggerService
   */
  public async error(title: string, data: string | object | [] = {}): Promise<boolean> {
    return await LoggerService.error(title, data);
  }

  /**
   * @description info log
   * @param title the title of the log.
   * @param data some optional data.
   * @memberof LoggerService
   */
  public async info(title: string, data: string | object | [] = {}): Promise<boolean> {
    return await LoggerService.info(title, data);
  }

  /**
   * @description warning log. Meaning that it's not a disaster but weird and should be investigated.
   * @param title the title of the log message.
   * @param data optional data object to print out.
   * @memberof LoggerService
   */
  public async warning(title: string, data: string | object | [] = {}): Promise<boolean> {
    return LoggerService.warning(title, data);
  }

  /**
   * @description debug log
   * @param title the title of the log
   * @param data some optional data.
   * @memberof LoggerService
   */
  public static async debug(title: string, data: string | object | [] = {}): Promise<boolean> {
    if (this.areDebugLogsOn) {
      this.logs.push(new Log({ level: DebugLevel.SERVICE, title, data, type: LogType.DEBUG }));

      console.debug(`🐛 ${title}`, data); // eslint-disable-line no-console,security-node/detect-crlf
      this._logData(data, LogType.DEBUG);
    }

    return true;
  }

  /**
   * @description error log
   * @param {string} title the title of the log message
   * @param {string|object} data additional data
   * @memberof LoggerService
   */
  public static async error(title: string, data: string | object | [] = {}): Promise<boolean> {
    this.logs.push(new Log({ title, data, type: LogType.ERROR }));

    console.error(`🆘 ${title}`); // eslint-disable-line no-console,security-node/detect-crlf
    this._logData(data, LogType.ERROR);

    return true;
  }

  /**
   * @description info log
   * @param {string} title the title of the log message
   * @param {string|object} data additional data
   * @memberof LoggerService
   */
  public static async info(title: string, data: string | object | [] = {}): Promise<boolean> {
    this.logs.push(new Log({ title, data, type: LogType.INFO }));

    console.info(`ℹ️ ${title}`); // eslint-disable-line no-console,security-node/detect-crlf
    this._logData(data, LogType.INFO);

    return true;
  }

  /**
   * @description warning log. Meaning that it's not a disaster but weird and should be investigated.
   * @param title the title of the log message.
   * @param data optional data object to print out.
   * @memberof LoggerService
   */
  public static async warning(title: string, data: string | object | [] = {}): Promise<boolean> {
    this.logs.push(new Log({ title, data, type: LogType.WARNING }));

    console.info(`⚠️ ${title}`); // eslint-disable-line no-console,security-node/detect-crlf
    this._logData(data, LogType.WARNING);

    return true;
  }

  private static async _logData(data: string | object | [] = {}, logType: LogType = LogType.DEBUG): Promise<boolean> {
    if (!data) {
      return false;
    }
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      return false;
    }

    try {
      console.log(`${logType}     ${CircularJson.stringify(data)}`); // eslint-disable-line no-console,security-node/detect-crlf
    } catch (error) {
      console.error('Failed to log data'); // eslint-disable-line no-console
      return false;
    }

    return true;
  }

  /**
   * @description Decorator for method call logging.
   * @param {string[]} shallowErrors errors to skip error throwing
   * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => void}
   */
  public static functionCallLogger(...shallowErrors) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      const method = descriptor.value;

      descriptor.value = async function (...args) {
        this.debug('%s.%s', this.name || this.constructor.name, method.name, args);

        try {
          return await method.call(this, ...args);
        } catch (error) {
          this.error('%s.%s', this.name, method.name, { error: error.message || error });

          if (shallowErrors.includes(error.code)) {
            return undefined;
          }

          throw error;
        }
      };
    };
  }
}
