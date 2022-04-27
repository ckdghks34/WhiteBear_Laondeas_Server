import pool from "../../config/dbpool.js";

// 공지사항 가져오기
async function getNotice(req, res, next) {
  try {
    const sql = "select * from notice order by notice_seq desc";
    const result = await pool.query(sql);
    res.status(200).json({
      message: "공지사항 가져오기 성공",
      data: result[0],
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "공지사항 가져오기 실패",
    });
  }
}
// 공지사항 등록
async function createNotice(req, res, next) {
  let { user_seq, title, content } = req.body;

  if (user_seq === undefined || title === undefined || content === undefined) {
    res.status(400).json({
      message: "공지사항 등록 실패, 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql =
        "insert into notice (author ,title, content,view_count, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?)";
      const result = await pool.execute(sql, [
        user_seq,
        title,
        content,
        0,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "공지사항 등록 성공",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "공지사항 등록 실패",
      });
    }
  }
}
// 공지사항 수정
async function updateNotice(req, res, next) {
  let { notice_seq, user_seq, title, content } = req.body;

  if (
    notice_seq === undefined ||
    user_seq === undefined ||
    title === undefined ||
    content === undefined
  ) {
    res.status(400).json({
      message: "공지사항 수정 실패, 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql =
        "update notice set title = ?, content = ?, last_register_id = ?, last_register_date = ? where notice_seq = ?";

      await pool.execute(sql, [title, content, user_seq, new Date(), notice_seq]);

      res.status(200).json({
        message: "공지사항 수정 성공",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "공지사항 수정 실패",
      });
    }
  }
}

// 공지사항 삭제
async function deleteNotice(req, res, next) {
  let { notice_seq } = req.body;

  if (notice_seq === undefined) {
    res.status(400).json({
      message: "공지사항 삭제 실패, 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = "delete from notice where notice_seq = ?";

      await pool.execute(sql, [notice_seq]);

      res.status(200).json({
        message: "공지사항 삭제 성공",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "공지사항 삭제 실패",
      });
    }
  }
}

// 조회수 증가
async function increaseViewCount(req, res, next) {
  let { notice_seq } = req.body;

  if (notice_seq === undefined) {
    res.status(400).json({
      message: "조회수 증가 실패, 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = "update notice set view_count = view_count + 1 where notice_seq = ?";

      await pool.execute(sql, [notice_seq]);

      res.status(200).json({
        message: "조회수 증가 성공",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "조회수 증가 실패",
      });
    }
  }
}

// 공지사항 상세 조회
async function getNoticeDetail(req, res, next) {
  let { notice_seq } = req.query;

  if (notice_seq === undefined) {
    res.status(400).json({
      message: "공지사항 상세 조회 실패, 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = "select * from notice where notice_seq = ?";
      const result = await pool.query(sql, [notice_seq]);

      res.status(200).json({
        message: "공지사항 상세 조회 성공",
        data: result[0],
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "공지사항 상세 조회 실패",
      });
    }
  }
}

export { getNotice, createNotice, updateNotice, deleteNotice, increaseViewCount, getNoticeDetail };
