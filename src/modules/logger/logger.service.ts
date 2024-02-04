import * as Winston from 'winston';
import chalk from 'chalk';
import { createLogger, LoggerOptions } from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logger: Winston.Logger;

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
      transports: [
        new Winston.transports.File({
          filename: `${MyLogger.LOGS_PATH}/${level}.log`,
        }),
      ],
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

    this.logToConsole('info', message);
  }

  error(message: string, trace?: string): void {
    this.setLevel('error');
    const currentDate = new Date();
    // i think the trace should be JSON Stringified
    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('error', message);
  }

  warn(message: string): void {
    this.setLevel('warn');
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('warn', message);
  }

  info(message: string): void {
    this.setLevel('info');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('info', message);
  }

  debug(message: string): void {
    this.setLevel('debug');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('debug', message);
  }

  overrideOptions(options: LoggerOptions): void {
    this.logger.configure(options);
  }

  // this method just for printing a cool log in your terminal , using chalk
  private logToConsole(level: string, message: string): void {
    let result;
    const currentDate = new Date();
    const time = currentDate.toLocaleTimeString('en-US', { hour12: false });

    switch (level) {
      default:
      case 'info':
        result = `[${chalk.blue('INFO')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`;
        break;
      case 'error':
        result = `[${chalk.red('ERR')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`;
        break;
      case 'warn':
        result = `[${chalk.yellow('WARN')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`;
        break;
    }
    console.log(result); // TODO: DON'T remove this console.log

    this.logger.close();
  }
}
