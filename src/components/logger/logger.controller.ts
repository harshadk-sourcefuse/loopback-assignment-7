import { inject } from '@loopback/core';
import { Request, RestBindings, api, get } from '@loopback/rest';

/**
 * A simple controller to bounce back http requests
 */
@api({
    basePath: '/log',
    paths: {
        '/info': {
            get: {
                operationId: 'LoggerController.logInfo',
                'x-operation-name': 'logInfo',
                'x-controller-name': 'LoggerController',
                responses: {
                    '200': {
                        description: 'Logger Response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    title: 'LoggerResponse',
                                    properties: {
                                        log_types: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    name: { type: 'string' }
                                                }
                                            }
                                        },
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
                        }
                    }
                },
            }
        }
    }
})
export class LoggerController {
    constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

    logInfo(): object {
        // Reply with a log_type, the current time, the url, and request headers
        return {
            log_type: [
                { name: 'INFO' },
                { name: 'DEBUG' },
                { name: 'WARNING' },
                { name: 'ERROR' },
            ],
            date: new Date(),
            url: this.req.url,
            headers: Object.assign({}, this.req.headers),
        };
    }
}
