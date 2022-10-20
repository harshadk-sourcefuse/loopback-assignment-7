import {
  injectable, Interceptor, InvocationContext,
  InvocationResult, Provider, ValueOrPromise,
} from '@loopback/core';
import { logger } from '../components/logger/logger.constants';
import winston from 'winston';

@injectable({ tags: { key: LoggerInterceptor.BINDING_KEY } })
export class LoggerInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${LoggerInterceptor.name}`;
  logger: winston.Logger = logger;

  value() {
    return this.intercept.bind(this);
  }

  async intercept(invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,) {
    try {
      this.logger.info('intercept: before-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
      const result = await next();
      this.logger.info('intercept: after-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
      return result;
    }
    catch (err) {
      this.logger.info('intercept: error-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
      throw err;
    }
  }
}
