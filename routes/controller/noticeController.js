import pool from "../../config/dbpool.js";

// 공지사항 가져오기
async function getNotice(req, res, next) {
  const sql = "select * from notice";
  pool.query(sql, (err, results) => {
    if (err) console.log(err);

    res.status(200).json({
      message: "공지사항 불러오기 성공",
      notice: results,
    });
  });
}
// 공지사항 등록
async function createNotice(req, res, next) {
  let { user_seq, title, content } = req.body;

  if (user_seq && title && content) {
    const sql =
      "insert into notice (author ,title, content,view_count, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?)";

    pool.query(
      sql,
      [user_seq, title, content, 0, user_seq, new Date(), user_seq, new Date()],
      (err, result) => {
        if (err) console.log(err);

        if (result) {
          res.status(200).json({
            message: "공지사항 등록 성공",
          });
        } else {
          res.status(401).json({
            message: "공지사항 등록 실패",
          });
        }
      }
    );
  } else {
    res.status(401).json({
      message: "공지사항 등록 실패, 필수 데이터가 없습니다.",
    });
  }
}
// 공지사항 수정
async function updateNotice(req, res, next) {
  let { notice_seq, user_seq, title, content } = req.body;

  if (notice_seq && user_seq && title && content) {
    const sql =
      "update notice set title = ?, content = ?, last_register_id = ?, last_register_date = ? where notice_seq = ?";

    pool.query(sql, [title, content, user_seq, new Date(), notice_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "공지사항 수정 성공",
        });
      } else {
        res.status(401).json({
          message: "공지사항 수정 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "공지사항 수정 실패, 필수 데이터가 없습니다.",
    });
  }
}

// 공지사항 삭제
async function deleteNotice(req, res, next) {
  let { notice_seq } = req.body;

  if (notice_seq) {
    const sql = "delete from notice where notice_seq = ?";

    pool.query(sql, [notice_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "공지사항 삭제 성공",
        });
      } else {
        res.status(401).json({
          message: "공지사항 삭제 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "공지사항 삭제 실패, 필수 데이터가 없습니다.",
    });
  }
}

// 조회수 증가
async function increaseViewCount(req, res, next) {
  let { notice_seq } = req.body;

  if (notice_seq) {
    const sql = "update notice set view_count = view_count + 1 where notice_seq = ?";

    pool.query(sql, [notice_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "조회수 증가 성공",
        });
      } else {
        res.status(401).json({
          message: "조회수 증가 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "조회수 증가 실패, 필수 데이터가 없습니다.",
    });
  }
}

// 공지사항 상세 조회
async function getNoticeDetail(req, res, next) {
  let { notice_seq } = req.query;

  if (notice_seq) {
    const sql = "select * from notice where notice_seq = ?";

    pool.query(sql, [notice_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "공지사항 상세 조회 성공",
          notice: result,
        });
      } else {
        res.status(401).json({
          message: "공지사항 상세 조회 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "공지사항 상세 조회 실패, 공지사항 시퀀스가 없습니다.",
    });
  }
}

export { getNotice, createNotice, updateNotice, deleteNotice, increaseViewCount, getNoticeDetail };
