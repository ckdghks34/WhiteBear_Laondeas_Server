import pool from "../../config/dbpool.js";

// 특정 아이디 조회하기
async function getUser(req, res, next) {
  const { user_id } = req.query;

  if (user_id === undefined) {
    res.status(401).json({
      message: "유저 정보 조회 실패 , 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from user where id = ?`;

      const results = await pool.query(sql, user_id);

      if (results[0].length == 0) {
        res.status(401).json({
          message: "존재하지 않는 유저입니다.",
        });
      } else {
        res.status(200).json({
          message: "유저 정보 조회 성공",
          user: results[0][0],
        });
      }
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "유저 정보 조회 실패",
      });
    }
  }
}

// 회원정보 수정
async function updateUser(req, res, next) {
  const { user_id, user_name, user_password, user_email } = req.body;

  if (
    user_id === undefined ||
    user_name === undefined ||
    user_password === undefined ||
    user_email === undefined
  ) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set name = ?, password = ?, email = ? where id = ?`;
      await pool.pool(sql, [user_name, user_password, user_email, user_id]);

      res.status(200).json({
        message: "회원정보 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "회원정보 수정 실패",
      });
    }
  }
}

// 관심 캠페인 가져오기

// 나의 캠페인 가져오기

// 종료된 캠페인 가져오기

// 출석체크

// 출석 리스트 가져오기

// 전체 유저 포인트 적립내역 가져오기

// 전체 유저 포인트 출금내역 가져오기

// 유저별 포인트 적립내역 가져오기

// 유저별 포인트 출금내역 가져오기

// 메세지 목록 보기

// 메세지 보내기

// 메세지 확인

// 문의 등록

// 답변 등록

// 전체 문의 답변 리스트 가져오기
async function getQNAList(req, res, next) {
  try {
    const sql = `select q.qna_seq, q.author, q.category, q.title, q.content, q.first_register_id, q.first_register_date, a.answer_seq ,a.author as answer_author, a.title as answer_title, a.content as answer_content, a.first_register_date as answer_first_register, a.first_register_date as answer_first_register_date
  from question as q left outer join answer as a on q.qna_seq = a.qna_seq`;

    const results = await pool.query(sql);

    if (results[0].length == 0) {
      res.status(401).json({
        message: "등록된 문의 사항이 없습니다.",
      });
    } else {
      let result = [];

      for (let i = 0; i < results[0].length; i++) {
        let question = {};
        let answer = {};

        var resultkey = Object.keys(results[0][i]);
        for (let k = 0; k < resultkey.length; k++) {
          if (resultkey[k].split("_")[0] == "answer")
            answer[resultkey[k]] = results[0][i][resultkey[k]];
          else question[resultkey[k]] = results[0][i][resultkey[k]];
        }

        result.push({ question, answer });
      }

      res.status(200).json({
        message: "문의 전체 리스트 조회 성공",
        qna_list: result,
      });
    }
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "문의 전체 리스트 조회 실패",
    });
  }
}
// 특정 문의 & 답변 가져오기
async function getQNA(req, res, next) {
  const { qna_seq } = req.query;

  if (questtion_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const question_sql = `select * from qna where qna_seq = ?`;
      const answer_sql = `select * from answer where qna_seq = ?`;

      const question = await pool.query(question_sql, qna_seq);
      const answer = await pool.query(answer_sql, qna_seq);

      if (question[0].length == 0) {
        res.status(401).json({
          message: "존재하지 않는 문의입니다.",
        });
      } else {
        res.status(200).json({
          message: "문의 정보 조회 성공",
          question: question[0][0],
          answer: answer[0][0],
        });
      }
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "문의 정보 조회 실패",
      });
    }
  }
}
// 사용자 별 문의 & 답변 리스트 가져오기
async function getUserQNA(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      // const question_sql = `select * from qna where author = ?`;
      // const answer_sql = `select * from answer where qna_seq = ?`;

      // const question = await pool.query(question_sql, user_seq);
      // const answer = await pool.query(answer_sql, user_seq);

      const sql = `select q.qna_seq, q.author, q.category, q.title, q.content, q.first_register_id, q.first_register_date, a.answer_seq ,a.author as answer_author, a.title as answer_title, a.content as answer_content, a.first_register_date as answer_first_register, a.first_register_date as answer_first_register_date
      from (select *
      from question
      where author = ?) as q join answer as a on q.qna_seq = a.qna_seq`;

      let results = await pool.query(sql, user_seq);

      if (results[0].length == 0) {
        res.status(401).json({
          message: "등록된 문의 사항이 없습니다.",
        });
      } else {
        let result = [];

        for (let i = 0; i < results[0].length; i++) {
          let question = {};
          let answer = {};

          var resultkey = Object.keys(results[0][i]);
          for (let k = 0; k < resultkey.length; k++) {
            if (resultkey[k].split("_")[0] == "answer")
              answer[resultkey[k]] = results[0][i][resultkey[k]];
            else question[resultkey[k]] = results[0][i][resultkey[k]];
          }

          result.push({ question, answer });
        }

        console.log(result);

        res.status(200).json({
          message: "문의 정보 조회 성공",
          qna: result,
        });
      }
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "문의 정보 조회 실패",
      });
    }
  }
}

// 페널티 목록 가져오기
async function getPenaltyList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다.",
    });
  } else {
    try {
      const sql = `select * from penalty where user_seq = ?`;
      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "페널티 목록 조회 성공",
        penalty: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "페널티 목록 조회 실패",
      });
    }
  }
}

// 유저 페널티 추가
async function createPenalty(req, res, next) {}

// 유저 페널티 삭제
async function deletePenalty(req, res, next) {}

// 유저 페널티 수정
async function updatePenalty(req, res, next) {}

// 주소록 등록
async function createAddressBook(req, res, next) {
  const { user_seq, address_seq, name, receiver, address, phonenumber, is_default } = req.body;

  if (user_seq === undefined || address_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into address_book (user_seq, address_seq, name, receiver, address, phonenumber, is_default, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await pool.execute(sql, [
        user_seq,
        address_seq,
        name,
        receiver,
        address,
        phonenumber,
        is_default,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "주소록 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "주소록 등록 실패",
      });
    }
  }
}

// 주소록 삭제
async function deleteAddressBook(req, res, next) {
  const { user_seq, address_seq } = req.body;

  if (user_seq === undefined || address_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `delete from user_address_book where user_seq = ? and address_seq = ?`;

      await pool.execute(sql, [user_seq, address_seq]);

      res.status(200).json({
        message: "주소록 삭제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "주소록 삭제 실패",
      });
    }
  }
}

// 주소록 수정
async function updateAddressBook(req, res, next) {
  const { user_seq, address_seq, name, receiver, address, phonenumber, is_default } = req.body;

  if (user_seq === undefined || address_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user_address_book set name = ?, receiver = ?, address = ?, phonenumber = ?, is_default = ?, last_register_id = ?, last_register_date = ? where user_seq = ? and address_seq = ?`;
      await pool.execute(sql, [
        name,
        receiver,
        address,
        phonenumber,
        is_default,
        user_seq,
        new Date(),
        user_seq,
        address_seq,
      ]);

      res.status(200).json({
        message: "주소록 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "주소록 수정 실패",
      });
    }
  }
}

// 주소록 가져오기
async function getAddressBook(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from user_address_book where user_seq = ?`;
      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "주소록 조회 성공",
        addressBook: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "주소록 조회 실패",
      });
    }
  }
}

export {
  getUser,
  updateUser,
  getAddressBook,
  updateAddressBook,
  deleteAddressBook,
  createAddressBook,
  getPenaltyList,
  createPenalty,
  deletePenalty,
  updatePenalty,
  getUserQNA,
  getQNAList,
};
