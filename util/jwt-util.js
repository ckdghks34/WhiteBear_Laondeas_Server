import jwt from "jsonwebtoken";
import pool from "../config/dbpool.js";

const secret = process.env.SECRET;

async function sign(user) {
  // access token 발급
  const payload = {
    // access token에 들어갈 payload
    id: user.id,
    seq: user.user_seq,
  };

  return jwt.sign(payload, secret, {
    // secret으로 sign하여 발급하고 return
    algorithm: "HS256", // 암호화 알고리즘
    expiresIn: "1h", // 유효기간
  });
}
async function verify(token) {
  // access token 검증
  let decoded = null;

  try {
    decoded = jwt.verify(token, secret);
    console.log("도대체 어디지?");
    console.log(decoded);
    return {
      verification: true,
      id: decoded.id,
      seq: decoded.user_seq,
    };
  } catch (err) {
    console.log("여긴가?");

    return {
      verification: false,
      message: err.message,
    };
  }
}
async function refresh() {
  // refresh token 발급
  return jwt.sign({}, secret, {
    // refresh token은 payload 없이 발급
    algorithm: "HS256",
    expiresIn: "14d",
  });
}
async function refreshVerify(token, user_seq, user_id) {
  // refresh token 검증
  /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
  const sql = `select * from token where user_seq = ?`;

  try {
    const data = await pool.query(sql, [user_seq]); // refresh token 가져오기
    if (token === data[0][0].refreshtoken) {
      try {
        jwt.verify(token, secret);
        return { verification: true };
      } catch (err) {
        console(err);
        return { verification: false };
      }
    } else {
      return { verification: false };
    }
  } catch (err) {
    return false;
  }
}

export { sign, verify, refresh, refreshVerify };