import bcrypt from "bcrypt";
import pool from "./../../../config/dbpool.js";
import dotenv from "dotenv";
import * as jwt from "./../../../util/jwt-util.js";
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
      let now = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
      user_password = bcrypt.hashSync(user_password, process.env.salt);
      const sql = `Insert into user (id, password, name, nickname, email, phonenumber, agreement_info, agreement_email, agreement_mms, is_advertiser,first_register_date,last_register_date,is_admin) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
      const result = await dbpool.execute(sql, [
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
        now,
        now,
        is_admin,
      ]);

      res.status(200).json({
        message: "회원가입 성공",
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

  if (user_id && user_password) {
    console.log(user_id, user_password);
    try {
      const sql = `SELECT * FROM user WHERE id = ?`;
      const results = await dbpool.query(sql, user_id);
      // 아이디가 존재하지 않을 때
      if (results.length === 0) {
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
              const accessToken = await jwt.sign(user);
              const refreshToken = await jwt.refresh();

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

// 회원탈퇴
async function deleteUser(req, res, next) {
  const { user_id } = req.body;

  if (user_id === undefined) {
    res.status(401).json({
      message: "회원탈퇴 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `DELETE FROM user WHERE id = ?`;
      await dbpool.execute(sql, user_id);

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

export { signup, login, deleteUser, checkID };
