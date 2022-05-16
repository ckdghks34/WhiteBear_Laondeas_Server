import { sign, verify, refreshVerify } from "./../../util/jwt-util.js";
import pool from "./../../config/dbpool.js";
import jwt from "jsonwebtoken";

const dbpool = await pool;

async function refresh(req, res) {
  // access token과 refresh token의 존재 유무를 체크합니다.
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split("Bearer ")[1];
    const refreshToken = req.headers.refresh;

    // access token 검증 -> expired여야 함.
    const authResult = await verify(authToken);
    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);

    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(401).send({
        verification: false,
        message: "No authorized!",
      });
    }
    let user = { user_seq: decoded.seq, id: decoded.id };
    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = await refreshVerify(refreshToken, decoded.seq, decoded.id);

    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.verification === false) {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인 해야함.
      if (refreshResult.verification === false) {
        res.status(401).json({
          verification: true,
          expire: true,
          message: "No authorized!",
        });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = await sign(user);

        try {
          await dbpool.execute("update token set accesstoken = ? where user_seq = ?", [
            newAccessToken,
            user.user_seq,
          ]);

          res.status(200).json({
            // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
            verification: true,
            data: {
              accessToken: newAccessToken,
              refreshToken,
            },
          });
        } catch (err) {
          console.log(err);

          res.status(500).json({
            verification: false,
            message: "Internal Server Error",
          });
        }
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      res.status(400).send({
        verification: false,
        message: "Access token is not expired!",
      });
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).send({
      verification: false,
      message: "Access token and refresh token are need for refresh!",
    });
  }
}

export { refresh };
