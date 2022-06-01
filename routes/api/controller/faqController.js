import pool from "./../../../config/dbpool.js";

const dbpool = await pool;

// faq 불러오기
async function getFaq(req, res, next) {
  try {
    const sql = "select * from faq";

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "faq 불러오기 성공",
      faq: results[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "faq 불러오기 실패",
    });
  }
}

// faq 등록
async function createFaq(req, res, next) {
  const { user_seq, category, title, content } = req.body;

  if (
    user_seq === undefined ||
    category === undefined ||
    title === undefined ||
    content === undefined
  ) {
    res.status(400).json({
      message: "faq 등록 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `insert into faq (category, title, content, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?,?,?,?,?)`;

      const results = await dbpool.execute(sql, [
        category,
        title,
        content,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "faq 등록 성공",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "faq 등록 실패",
      });
    }
  }
}

// faq 수정
async function updateFaq(req, res, next) {
  const { faq_seq, user_seq, category, title, content } = req.body;

  if (
    faq_seq === undefined ||
    user_seq === undefined ||
    category === undefined ||
    title === undefined ||
    content === undefined
  ) {
    res.status(400).json({
      message: "faq 수정 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `update faq set category = ?, title = ?, content = ?, last_register_id = ?, last_register_date = ? where faq_seq = ?`;

      const results = await dbpool.execute(sql, [
        category,
        title,
        content,
        user_seq,
        new Date(),
        faq_seq,
      ]);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "faq 수정 실패",
      });
    }
  }
}

// faq 삭제
async function deleteFaq(req, res, next) {
  const { faq_seq } = req.body;

  if (faq_seq === undefined) {
    res.status(400).json({
      message: "faq 삭제 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `delete from faq where faq_seq = ?`;

      const results = await dbpool.execute(sql, [faq_seq]);

      res.status(200).json({
        message: "faq 삭제 성공",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "faq 삭제 실패",
      });
    }
  }
}

export { getFaq, createFaq, updateFaq, deleteFaq };
