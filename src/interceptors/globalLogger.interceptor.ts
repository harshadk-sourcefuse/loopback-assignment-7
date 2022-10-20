import {
    globalInterceptor, Interceptor, InvocationContext,
    InvocationResult, Provider, ValueOrPromise,
  } from '@loopback/core';
  import { logger } from '../components/logger/logger.constants';
  import winston from 'winston';
  
  @globalInterceptor('log', { tags: { name: 'globalLogger' } })
  export class GlobalLoggerInterceptor implements Provider<Interceptor> {
    logger: winston.Logger = logger;
    constructor() { }
  
    value() {
      return this.intercept.bind(this);
    }
  
    async intercept(invocationCtx: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,) {
      try {
        this.logger.info('global intercept: before-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
        const result = await next();
        this.logger.info('global intercept: after-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
        return result;
      }
      catch (err) {
        this.logger.info('global intercept: error-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
        throw err;
      }
    }
  } 