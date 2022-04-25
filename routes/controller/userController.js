import mysql from "mysql";
import dbconfig from "../../config/dbconfig.js";

const conn = mysql.createConnection(dbconfig);

// 특정 아이디 조회하기
async function getUser(req, res, next) {
  const { user_id } = req.query;

  if (user_id) {
    const sql = `select * from user where id = ?`;
    conn.query(sql, user_id, (err, results) => {
      if (err) console.log(err);

      // 아이디가 존재하지 않으면
      if (results.length === 0) {
        res.status(401).json({
          message: "해당 아이디가 없습니다.",
        });
      }
      // 아이디가 존재하면
      else {
        let user = results[0];
        user.password = undefined;
        res.status(200).json({
          message: "아이디 조회 성공",
          user: user,
        });
      }
    });
  } else {
    res.status(401).json({
      message: "아이디를 입력해주세요.",
    });
  }
}
export { getUser };
