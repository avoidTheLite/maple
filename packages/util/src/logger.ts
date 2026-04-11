import pino from 'pino';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LoggerOptions = {
  module: string;
  level?: LogLevel;
};

export function createLogger(options: LoggerOptions): pino.Logger {
  return pino({
    name: options.module,
    level: options.level ?? 'info',
  });
}
