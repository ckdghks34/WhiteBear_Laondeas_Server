import bcrypt from "bcrypt";
import pool from "./../../../config/dbpool.js";
import dotenv from "dotenv";
import { sign, verify, refresh, refreshVerify } from "./../../../util/jwt-util.js";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const dbpool = await pool;

// 회원가입
async function signup(req, res, next) {
  console.log(signup);

  let {
    user_id,
    user_password,
    user_name,
    user_nickname,
    user_email,
    user_phonenumber,
    agreement_info,
    agreement_email,
    agreement_mms,
    is_advertiser,
    is_admin,
  } = req.body;

  if (
    user_id === undefined ||
    user_password === undefined ||
    user_name === undefined ||
    user_nickname === undefined ||
    user_email === undefined ||
    user_phonenumber === undefined ||
    agreement_info === undefined ||
    agreement_email === undefined ||
    agreement_mms === undefined ||
    is_advertiser === undefined ||
    is_admin === undefined
  ) {
    res.status(401).json({
      message: "회원가입 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      user_password = bcrypt.hashSync(user_password, 10);
      const sql = `Insert into user (id, password, name, nickname, email, phonenumber,grade, agreement_info, agreement_email, agreement_mms, is_premium, is_advertiser, point, accumulated_point, first_register_date, last_register_date, is_admin) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const result = await dbpool.execute(sql, [
        user_id,
        user_password,
        user_name,
        user_nickname,
        user_email,
        user_phonenumber,
        1,
        agreement_info,
        agreement_email,
        agreement_mms,
        0,
        is_advertiser,
        0,
        0,
        new Date(),
        new Date(),
        is_admin,
      ]);

      res.status(200).json({
        message: "회원가입 성공",
        insertid: result[0].insertId,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "회원가입 실패",
      });
    }
  }
}

// 로그인
async function login(req, res, next) {
  const { user_id, user_password } = req.body;

  if (user_id !== undefined && user_password !== undefined) {
    try {
      const sql = `SELECT * FROM user WHERE id = ?`;
      const results = await dbpool.query(sql, user_id);
      // 아이디가 존재하지 않을 때
      if (results[0].length === 0) {
        res.status(401).json({
          message: "아이디가 존재하지 않습니다.",
        });
        console.log("로그인 시도 : 아이디가 존재하지 않습니다.");
      } else {
        // 입력받은 비밀번호와 데이터베이스에 저장된 비밀번호(암호화 된) 비교
        try {
          const result = bcrypt.compareSync(user_password, results[0][0].password);
          // 비밀번호가 맞으면
          if (result) {
            try {
              let loginUser = results[0][0];
              loginUser.password = undefined;
              let user = { user_seq: loginUser.user_seq, id: loginUser.id };

              // accessToken, refreshToken 발급
              const accessToken = await sign(user);
              const refreshToken = await refresh();

              // accessToken, refreshToken 데이터베이스 저장
              let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;

              await dbpool.execute(tokensql, [
                loginUser.user_seq,
                loginUser.id,
                accessToken,
                refreshToken,
                accessToken,
                refreshToken,
              ]);

              res.status(200).json({
                message: "로그인 성공",
                user: loginUser,
                data: {
                  accessToken,
                  refreshToken,
                },
              });
            } catch (err) {
              console.log(err);

              res.status(401).json({
                message: "로그인 실패",
              });
            }
          } else {
            res.status(401).json({
              message: "비밀번호가 일치하지 않습니다.",
            });
          }
        } catch (err) {
          console.log(err);

          res.status(401).json({
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "로그인 실패",
      });
    }
  }
}

// 아이디 찾기

// 비밀번호 찾기

// 로그아웃
async function logout(req, res, next) {
  const { user_seq } = req.body;

  if (user_seq !== undefined) {
    try {
      const sql = `delete from token where user_seq = ?`;
      await dbpool.execute(sql, user_seq);

      res.status(200).json({
        message: "로그아웃 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "로그아웃 실패",
      });
    }
  }
}

// 회원탈퇴
async function deleteUser(req, res, next) {
  const { user_seq } = req.body;

  if (user_id === undefined) {
    res.status(401).json({
      message: "회원탈퇴 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `DELETE FROM user WHERE user_seq = ?`;
      await dbpool.execute(sql, user_seq);

      res.status(200).json({
        message: "회원탈퇴 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "회원탈퇴 실패",
      });
    }
  }
}

// 아이디체크
async function checkID(req, res, next) {
  const { user_id } = req.query;

  if (user_id === undefined) {
    res.status(401).json({
      message: "아이디 중복 체크 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `SELECT * FROM user WHERE id = ?`;

      const result = await dbpool.query(sql, user_id);

      if (result[0].length === 0) {
        res.status(200).json({
          message: "사용 가능한 아이디입니다.",
          flag: true,
        });
      } else {
        res.status(200).json({
          message: "아이디가 중복됩니다.",
          flag: false,
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "아이디 중복 체크 실패",
      });
    }
  }
}

// 코드 목록가져오기
async function getCodetable(req, res, next) {
  try {
    const sql = `SELECT * FROM code_table`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "코드테이블 조회 성공",
      data: results,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "코드테이블 조회 실패",
    });
  }
}

// 코드 등록
async function addCode(req, res, next) {
  const { code_value, code_name, top_level_code, code_step } = req.body;

  if (
    code_value === undefined ||
    code_name === undefined ||
    top_level_code === undefined ||
    code_step === undefined
  ) {
    res.status(401).json({
      message: "코드 등록 실패, 필수 항목이 없습니다.",
    });
  }

  try {
    const sql = `INSERT INTO code_table (code_value, code_name, top_level_code, code_step) VALUES (?,?,?,?)`;

    await dbpool.execute(sql, [code_value, code_name, top_level_code, code_step]);

    res.status(200).json({
      message: "코드 등록 성공",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "코드 등록 실패",
    });
  }
}

// Token 로그인
async function tokenLogin(req, res, next) {
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split("Bearer ")[1];
    const refreshToken = req.headers.refresh;

    const authResult = await verify(authToken);
    const decoded = jwt.decode(authToken);

    if (decoded === null) {
      res.status(401).json({
        message: "invalid token",
        expire: "undefined",
        verification: false,
      });
    }

    let user = { user_seq: decoded.seq, id: decoded.id };

    const refreshResult = await refreshVerify(refreshToken, decoded.seq, decoded.id);

    if (authResult.verification || refreshResult.verification) {
      // 새로운 accessToken, refreshToken 발급
      const newAccessToken = await sign(user);
      const newRefreshToken = await refresh(user);

      // 새로운 accessToken, refreshToken 데이터베이스 저장
      let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;
      let usersql = `select * from user where user_seq = ?`;

      await dbpool.beginTransaction();

      await dbpool.execute(tokensql, [
        user.user_seq,
        user.id,
        newAccessToken,
        newRefreshToken,
        newAccessToken,
        newRefreshToken,
      ]);
      const results = await dbpool.query(usersql, user.user_seq);
      const loginuser = results[0][0];

      await dbpool.commit();

      res.status(200).json({
        message: "로그인 성공",
        user: loginuser,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } else {
      res.status(401).json({
        message: "all of tokens is expired",
        expire: true,
        verification: false,
      });
    }
  } else {
    res.status(401).json({
      message: "token is not exist",
      expire: "undefined",
      verification: false,
    });
  }
}

// 카카오 로그인
async function kakaoLogin(req, res, next) {
  if (req.headers.authorization) {
    const kakaoAuthToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const info = await axios.post(
        "https://kapi.kakao.com/v2/user/me",
        {},
        {
          headers: {
            Authorization: `Bearer ${kakaoAuthToken}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      const kakaoUser = info.data;
      const sql = `SELECT * FROM user WHERE id = ?`;
      const results = await dbpool.query(sql, info.data.id);

      // 사용자가 없을 경우
      if (results[0].length === 0) {
        let password = bcrypt.hashSync(kakaoUser.kakao_account.email, 10);
        const sql = `Insert into user (id, password, name, nickname, email, phonenumber, grade, agreement_info, agreement_email, agreement_mms, is_premium, is_advertiser, point, accumulated_point, first_register_date, last_register_date, is_admin) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await dbpool.execute(sql, [
          kakaoUser.id,
          password,
          kakaoUser.kakao_account.email,
          kakaoUser.kakao_account.email,
          kakaoUser.kakao_account.email,
          "",
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          new Date(),
          new Date(),
          0,
        ]);
        const user = { user_seq: result[0].insertId, id: kakaoUser.id };

        const newAccessToken = await sign(user);
        const newRefreshToken = await refresh(user);

        let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;

        await dbpool.execute(tokensql, [
          user.user_seq,
          user.id,
          newAccessToken,
          newRefreshToken,
          newAccessToken,
          newRefreshToken,
        ]);

        const loginUser = await dbpool.query(sql, user.user_seq);

        res.status(200).json({
          message: "로그인 성공",
          user: loginUser[0][0],
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        });
      } else {
        // 사용자가 있을 경우
        const user = { user_seq: results[0][0].user_seq, id: results[0][0].id };

        const newAccessToken = await sign(user);
        const newRefreshToken = await refresh(user);

        // 새로운 accessToken, refreshToken 데이터베이스 저장
        let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;

        await dbpool.execute(tokensql, [
          user.user_seq,
          user.id,
          newAccessToken,
          newRefreshToken,
          newAccessToken,
          newRefreshToken,
        ]);

        res.status(200).json({
          message: "로그인 성공",
          user: results[0][0],
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "카카오 로그인 실패",
      });
    }
  } else {
    res.status(401).json({
      message: "token is not exist",
      expire: "undefined",
      verification: false,
    });
  }
}

// 네이버 로그인
async function naverLogin(req, res, next) {
  const { id, name, email, gender, mobile, birthyear, profile_image } = req.body;

  if (
    id === undefined ||
    name === undefined ||
    email === undefined ||
    gender === undefined ||
    mobile === undefined ||
    birthyear === undefined
  ) {
    res.status(401).json({
      message: "로그인 실패, 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `SELECT * FROM user WHERE id = ?`;
      const results = await dbpool.query(sql, id);
      let phonenumber = mobile.replace(/-/gi, "");
      // 사용자가 없을 경우
      if (results[0].length === 0) {
        let password = bcrypt.hashSync(email, 10);

        let result;
        if (profile_image === undefined) {
          const sql = `Insert into user (id, password, name, nickname, email, phonenumber, gender, birth, grade, agreement_info, agreement_email, agreement_mms, is_premium, is_advertiser, point, accumulated_point, first_register_date, last_register_date, is_admin) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

          result = await dbpool.execute(sql, [
            id,
            password,
            name,
            name,
            email,
            phonenumber,
            gender.toUpperCase(),
            birthyear,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            new Date(),
            new Date(),
            0,
          ]);
        } else {
          const profile_split = profile_image.split("/");
          const profile_name = profile_split[profile_split.length - 1];
          const profile_ext = profile_name.split(".")[1];

          const sql = `Insert into user (id, password, name, nickname, email, phonenumber, gender, birth, grade, profile_name, profile_path, profile_ext, profile_key, agreement_info, agreement_email, agreement_mms, is_premium, is_advertiser, point, accumulated_point, first_register_date, last_register_date, is_admin) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

          result = await dbpool.execute(sql, [
            id,
            password,
            name,
            name,
            email,
            phonenumber,
            gender.toUpperCase(),
            birthyear,
            1,
            profile_name,
            profile_image,
            profile_ext,
            profile_image,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            new Date(),
            new Date(),
            0,
          ]);
        }
        const user = { user_seq: result[0].insertId, id: id };

        const newAccessToken = await sign(user);
        const newRefreshToken = await refresh(user);

        let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;

        await dbpool.execute(tokensql, [
          user.user_seq,
          user.id,
          newAccessToken,
          newRefreshToken,
          newAccessToken,
          newRefreshToken,
        ]);

        const loginUser = await dbpool.query(sql, user.user_seq);

        res.status(200).json({
          message: "로그인 성공",
          user: loginUser[0][0],
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        });
      }
      // 사용자가 있을 경우
      else {
        const user = { user_seq: results[0][0].user_seq, id: results[0][0].id };

        const newAccessToken = await sign(user);
        const newRefreshToken = await refresh(user);

        // 새로운 accessToken, refreshToken 데이터베이스 저장
        let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;

        await dbpool.execute(tokensql, [
          user.user_seq,
          user.id,
          newAccessToken,
          newRefreshToken,
          newAccessToken,
          newRefreshToken,
        ]);

        res.status(200).json({
          message: "로그인 성공",
          user: results[0][0],
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "네이버 로그인 실패",
      });
    }
  }
}

export {
  signup,
  login,
  deleteUser,
  checkID,
  getCodetable,
  addCode,
  logout,
  tokenLogin,
  kakaoLogin,
  naverLogin,
};
