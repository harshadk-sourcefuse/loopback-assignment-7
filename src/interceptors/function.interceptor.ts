import { Interceptor } from "@loopback/core";
import { logger } from "../components/logger/logger.constants";

export const interceptorFn: Interceptor = async (invocationCtx, next) => {
    try {
        logger.info('interceptorFn: before-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
        const result = await next();
        logger.info('interceptorFn: after-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
        return result;
    } catch (error) {
        logger.info('interceptorFn: error-' + invocationCtx.targetName + ' ' + invocationCtx.methodName);
        throw error;
    }
};
