import { verify } from "../../util/jwt-util.js";

const errorTokenExpired = "TokenExpiredError";
const errorJsonWebToken = "JsonWebTokenError";

async function authJWT(req, res, next) {
  return next();
  
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1]; // header에서 access token을 가져옵니다.
    const result = await verify(token); // token을 검증합니다.
    if (result.verification) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      req.id = result.id;
      req.seq = result.seq;
      next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      if (result.error.name === errorTokenExpired) {
        res.status(401).send({
          verification: true,
          expire: true,
          message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
        });
      } else if (result.error.name === errorJsonWebToken) {
        res.status(401).send({
          verification: false,
          expire: "undefined",
          message: result.message,
        });
      }
    }
  } else {
    res.status(401).send({
      verification: false,
      expire: "undefined",
      message: "no token",
    });
  }
}

export { authJWT };
