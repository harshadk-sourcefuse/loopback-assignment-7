import { Middleware } from "@loopback/rest";
import * as jwt from 'jsonwebtoken';

const key = "kjsdaf98jk3hiumnf";
export const HeaderInterceptorMiddleware: Middleware = async (middlewareCtx, next) => {
    const { request, response } = middlewareCtx;
    console.log('Request: %s %s', request.method, request.originalUrl);
    try {
        var cookies = getCookieObject(request.headers.cookie);
        if (!request.headers.cookie && cookies.token) {
            return response.status(401).send({
                message: "Unauthorized - Token not found in cookie"
            });
        }
        try {
            const decodedToken: string | jwt.JwtPayload = jwt.verify(cookies.token, key);
            request.headers["authorization"] = `Bearer ${createJWT(typeof decodedToken == 'string' ? decodedToken : decodedToken.userId)}`;
        } catch (decodeError) {
            return response.status(401).send({
                message: "Failed to decode token - Invalid Token found"
            });
        }
        const result = await next();
        return result;
    } catch (err) {
        throw err;
    }
};

export const createJWT = (userId: number) => {
    return jwt.sign({ userId: userId }, key);
}

function getCookieObject(cookie?: string) {
    const result: { [key: string]: string } = {};
    cookie?.split("; ").forEach(ele => {
        const curr = ele.split("=");
        result[curr[0]] = curr.slice(1).join('=');
    });
    return result;
}

