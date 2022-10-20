import { config, inject } from '@loopback/core';
import { FindRoute, InvokeMethod, InvokeMiddleware, InvokeMiddlewareOptions, MiddlewareSequence, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler } from '@loopback/rest';
import { LoggerServiceImpl } from './components/logger/logger.service';
import { LogBinders, LOG_LEVEL } from './keys';

export class MySequence implements SequenceHandler {
    static defaultOptions: InvokeMiddlewareOptions = {
        chain: 'middlewareChain.rest',
        orderedGroups: [
            // Please note that middleware is cascading. The `sendResponse` is
            // added first to invoke downstream middleware to get the result or
            // catch errors so that it can produce the http response.
            'sendResponse',

            // default
            'cors',
            'apiSpec',

            // default
            'middleware',

            // rest
            'findRoute',

            // authentication
            'authentication',

            // rest
            'parseParams',
            'invokeMethod',
        ],
    };

    /**
     * Constructor: Injects `InvokeMiddleware` and `InvokeMiddlewareOptions`
     *
     * @param invokeMiddleware - invoker for registered middleware in a chain.
     * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
     */
    constructor(

        @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
        private headerInterceptor: InvokeMiddleware = () => {
            this.logger.log(LOG_LEVEL.INFO, "called");
            return false
        },
        @config()
        readonly options: InvokeMiddlewareOptions = MiddlewareSequence.defaultOptions,
        @inject(LogBinders.LOGGER) private logger: LoggerServiceImpl
    ) {
    }

    async handle(context: RequestContext): Promise<void> {
        const { request, response } = context;
        const referer = (request.headers['referer'] || request.headers['host'])?.replace(/(http|https):\/\//, '')?.split('/')[0];
        let message = `${request.method} ${request.url} started at ${new Date().toString()}.`;
        message = message + ` Referer : ${referer}`;
        message = message + ` User-Agent : ${request.headers['user-agent']}`;
        message = message + ` Remote Address : ${request['connection']['remoteAddress']}`;
        this.logger.log(LOG_LEVEL.INFO, message);

        try {
            // invoking middleware
            this.logger.log(LOG_LEVEL.DEBUG, `${request.method} ${request.url} :--: invoking middleware`);
            await this.headerInterceptor(context,this.options);
            this.logger.log(LOG_LEVEL.DEBUG, "Request Header Authorization : "+ request.headers.authorization);
        } catch (error) {
            this.logger.log(LOG_LEVEL.ERROR, `${request.method} ${request.url} error occured at ${new Date().toString()} ERROR: ${error.message} ${JSON.stringify(error, null, 2)}`);
            throw error;
        } finally {
            this.logger.log(LOG_LEVEL.INFO, `${request.method} ${request.url} completed at ${new Date().toString()}`);
        }
    }
}
