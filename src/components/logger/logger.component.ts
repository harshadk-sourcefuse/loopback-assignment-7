import { Component } from '@loopback/core';
import { LoggerInterceptor } from '../../interceptors';
import { LogBinders } from '../../keys';
import { LoggerController } from './logger.controller';
import { LogActionProvider } from './logger.provider';

export class LoggerComponent implements Component {
  controllers = [LoggerController];
  providers = {
    [LogBinders.LOGGER_PROVIDER.key]: LogActionProvider,
    [LogBinders.LOGGER_INTERCEPTOR.key]:LoggerInterceptor
  }


  constructor() {
  }
}