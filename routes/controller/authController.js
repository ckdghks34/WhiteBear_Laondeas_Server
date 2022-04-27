import pool from "../../config/dbpool.js";

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

  let now = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  user_password = bcrypt.hashSync(user_password, 10);
  const sql = `Insert into user (id, password, name, nickname, email, phonenumber, agreement_info, agreement_email, agreement_mms, is_advertiser,first_register_date,last_register_date,is_admin) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
  pool.query(
    sql,
    [
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
    ],
    (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "회원가입 성공",
        });
      } else {
        res.status(401).json({
          message: "회원가입 실패",
        });
      }
    }
  );
}

// 로그인
async function login(req, res, next) {
  const { user_id, user_password } = req.body;

  if (user_id && user_password) {
    console.log(user_id, user_password);
    const sql = `SELECT * FROM user WHERE id = ?`;
    pool.query(sql, user_id, (err, results) => {
      // 에러 발생 시  error 출력
      if (err) {
        console.log(err);
      }
      // 아이디가 존재하지 않을 때
      if (results.length === 0) {
        res.status(401).json({
          message: "아이디가 존재하지 않습니다.",
        });
        console.log("아이디가 존재하지 않습니다.");
      } else {
        // 입력받은 비밀번호와 데이터베이스에 저장된 비밀번호(암호화 된) 비교
        bcrypt.compare(user_password, results[0].password, (err, result) => {
          if (err) {
            console.log(err);
          }

          // 비밀번호가 맞으면
          if (result) {
            let loginUser = results[0];
            loginUser.password = undefined;

            res.status(200).json({
              message: "로그인 성공",
              user: loginUser,
            });
          }
          // 비밀번호가 틀리면
          else {
            res.status(401).json({
              message: "아이디 또는 비밀번호가 일치하지 않습니다.",
            });
          }
        });
      }
    });
  }
}

// 아이디 찾기

// 비밀번호 찾기

// 로그아웃

// 회원탈퇴
async function deleteUser(req, res, next) {
  const { user_id } = req.body;

  if (user_id) {
    const sql = `DELETE FROM user WHERE id = ?`;
    pool.query(sql, user_id, (err, result) => {
      if (err) {
        console.log(err);
      }

      if (result) {
        res.status(200).json({
          message: "회원탈퇴 성공",
        });
      } else {
        res.status(401).json({
          message: "회원탈퇴 실패",
        });
      }
    });
  }
}

// 아이디체크
async function checkID(req, res, next) {
  const { user_id } = req.query;

  if (user_id) {
    const sql = `SELECT * FROM user WHERE id = ?`;
    pool.query(sql, user_id, (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length === 0) {
        res.status(200).json({
          message: "사용 가능한 아이디 입니다.",
          flag: true,
        });
      } else {
        res.status(401).json({
          message: "이미 아이디가 존재합니다.",
          flag: false,
        });
      }
    });
  }
}

export { signup, login, deleteUser, checkID };
