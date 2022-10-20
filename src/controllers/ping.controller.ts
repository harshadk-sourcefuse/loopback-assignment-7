import { inject, intercept } from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
  api,
} from '@loopback/rest';
import { interceptorFn } from '../interceptors/function.interceptor';
import { LogBinders } from '../keys';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
@intercept(interceptorFn)
@api({
  basePath: '/ping'
})
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

  // Map to `GET /ping`
  @get('/')
  @response(200, PING_RESPONSE)
  @intercept(LogBinders.LOGGER_INTERCEPTOR)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
