import { createJWT } from './middlewares';
console.log(process.argv)
console.log(createJWT(+process.argv[2] || 1));