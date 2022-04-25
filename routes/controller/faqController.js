import mysql from "mysql";
import dbconfig from "../../config/dbconfig.js";

const conn = mysql.createConnection(dbconfig);

// faq 불러오기
async function getFaq(req, res, next) {
  const sql = "select * from faq";
  conn.query(sql, (err, results) => {
    if (err) console.log(err);

    res.status(200).json({
      message: "faq 불러오기 성공",
      faq: results,
    });
  });
}

// faq 등록
async function createFaq(req, res, next) {
  const { user_seq, category, title, content } = req.body;

  if (category && title && content) {
    const sql = `insert into faq (category, title, content, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?,?,?,?,?)`;

    conn.query(
      sql,
      [category, title, content, user_seq, new Date(), user_seq, new Date()],
      (err, result) => {
        if (err) console.log(err);

        if (result) {
          res.status(200).json({
            message: "faq 등록 성공",
          });
        } else {
          res.status(401).json({
            message: "faq 등록 실패",
          });
        }
      }
    );
  } else {
    res.status(401).json({
      message: "faq 등록 실패, 필수 항목이 없습니다.",
    });
  }
}
// faq 수정
async function updateFaq(req, res, next) {
  const { faq_seq, user_seq, category, title, content } = req.body;

  if (category && title && content) {
    const sql = `update faq set category = ?, title = ?, content = ?, last_register_id = ?, last_register_date = ? where faq_seq = ?`;

    conn.query(sql, [category, title, content, user_seq, new Date(), faq_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "faq 수정 성공",
        });
      } else {
        res.status(401).json({
          message: "faq 수정 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "faq 수정 실패, 필수 항목이 없습니다.",
    });
  }
}

// faq 삭제
async function deleteFaq(req, res, next) {
  const { faq_seq } = req.body;

  if (faq_seq) {
    const sql = `delete from faq where faq_seq = ?`;

    conn.query(sql, [faq_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "faq 삭제 성공",
        });
      } else {
        res.status(401).json({
          message: "faq 삭제 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "faq 삭제 실패, 해당 faq가 없습니다.",
    });
  }
}

export { getFaq, createFaq, updateFaq, deleteFaq };
