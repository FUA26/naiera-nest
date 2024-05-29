import * as winston from 'winston';
import * as chalk from 'chalk';
import { createLogger, LoggerOptions } from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger;

  private level = 'info';

  private context: string;

  private static LOGS_PATH = 'storage/logs';

  constructor() {
    this.logger = createLogger(this.getLoggerOptions(this.level));
    this.setContext('Main');
  }

  public getLoggerOptions(level: string): LoggerOptions {
    return {
      level: level,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'MM/DD/YYYY, HH:mm:ss',
        }),
        winston.format.printf((info) => {
          const { timestamp, level, message, context } = info;
          const color = chalk;

          let result;
          switch (level) {
            default:
            case 'info':
              result = `${color.red('[INFO]')} ${color.white(timestamp)} [${color.keyword('orange')(context)}] ${color.white(JSON.stringify(message))}`;
              break;
            case 'error':
              result = `${color.red('[ERR]')} ${color.white(timestamp)} [${color.keyword('orange')(context)}] ${color.white(JSON.stringify(message))}`;
              break;
            case 'warn':
              result = `${color.red('[WARN]')} ${color.white(timestamp)} [${color.keyword('orange')(context)}] ${color.white(JSON.stringify(message))}`;
              break;
          }

          return result;
        }),
      ),

      // You can chage methods
      transports: [new winston.transports.Console({})],
    };
  }
  public setContext(context: string): this {
    this.context = context;

    return this;
  }

  public setLevel(level: string): this {
    this.level = level;

    const loggerOptions = this.getLoggerOptions(level);
    this.overrideOptions(loggerOptions);

    return this;
  }

  log(message: string): void {
    this.setLevel('info');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    // this.logToConsole('info', message);
  }

  error(message: string): void {
    this.setLevel('error');
    const currentDate = new Date();
    this.logger.error(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    // this.logToConsole('error', JSON.stringify(message));
  }

  warn(message: string): void {
    this.setLevel('warn');
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    // this.logToConsole('warn', message);
  }

  info(message: string): void {
    this.setLevel('info');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    // this.logToConsole('info', message);
  }

  debug(message: string): void {
    this.setLevel('debug');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    // this.logToConsole('debug', message);
  }

  overrideOptions(options: LoggerOptions): void {
    this.logger.configure(options);
  }

  private logToConsole(level: string, message: string): void {
    let result;
    const color = chalk;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      default:
      case 'info':
        result = `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(
          time,
        )} [${color.green(this.context)}] ${message}`;
        break;
      case 'error':
        result = `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(
          time,
        )} [${color.green(this.context)}] ${message}`;
        break;
      case 'warn':
        result = `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(
          time,
        )} [${color.green(this.context)}] ${message}`;
        break;
    }
    console.log(result);

    this.logger.close();
  }
}
