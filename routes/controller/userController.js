import pool from "../../config/dbpool.js";

// 특정 아이디 조회하기
async function getUser(req, res, next) {
  const { user_id } = req.query;

  if (user_id) {
    const sql = `select * from user where id = ?`;
    pool.query(sql, user_id, (err, results) => {
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

// 회원정보 수정
async function updateUser(req, res, next) {
  const { user_id, user_name, user_password, user_email } = req.body;

  if (user_id) {
    const sql = `update user set name = ?, password = ?, email = ? where id = ?`;
    pool.query(sql, [user_name, user_password, user_email, user_id], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "회원정보 수정 성공",
        });
      } else {
        res.status(401).json({
          message: "회원정보 수정 실패",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "아이디를 입력해주세요.",
    });
  }
}

// 관심 캠페인 가져오기

// 나의 캠페인 가져오기

// 종료된 캠페인 가져오기

// 출석체크

// 출석 리스트 가져오기

// 포인트 적립내역 가져오기

// 포인트 출금내역 가져오기

// 메세지 목록 보기

// 메세지 보내기

// 메세지 확인

// 문의 등록

// 답변 등록

// 특정 문의 & 답변 가져오기

// 페널티 목록 가져오기
async function getPenaltyList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다.",
    });
  } else {
    const sql = `select * from penalty where user_seq = ?`;
    pool.query(sql, user_seq, (err, results) => {
      if (err) console.log(err);

      if (results) {
        res.status(200).json({
          message: "페널티 목록 조회 성공",
          penaltyList: results,
        });
      } else {
        res.status(401).json({
          message: "페널티 목록 조회 실패",
        });
      }
    });
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
      message: "잘못된 접근입니다.",
    });
  } else {
    const sql = `insert into address_book (user_seq, address_seq, name, receiver, address, phonenumber, is_default, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    pool.query(
      sql,
      [
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
      ],
      (err, result) => {
        if (err) console.log(err);

        if (result) {
          res.status(200).json({
            message: "주소록 등록 성공",
          });
        } else {
          res.status(401).json({
            message: "주소록 등록 실패",
          });
        }
      }
    );
  }
}

// 주소록 삭제
async function deleteAddressBook(req, res, next) {
  const { user_seq, address_seq } = req.body;

  if (user_seq === undefined || address_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다.",
    });
  } else {
    const sql = `delete from user_address_book where user_seq = ? and address_seq = ?`;

    pool.query(sql, [user_seq, address_seq], (err, result) => {
      if (err) console.log(err);

      if (result) {
        res.status(200).json({
          message: "주소록 삭제 성공",
        });
      } else {
        res.status(401).json({
          message: "주소록 삭제 실패",
        });
      }
    });
  }
}

// 주소록 수정
async function updateAddressBook(req, res, next) {
  const { user_seq, address_seq, name, receiver, address, phonenumber, is_default } = req.body;

  if (user_seq === undefined || address_seq === undefined) {
    res.status(401).json({
      message: "유저 또는 주소록 정보가 없습니다.",
    });
  } else {
    const sql = `update user_address_book set name = ?, receiver = ?, address = ?, phonenumber = ?, is_default = ?, last_register_id = ?, last_register_date = ? where user_seq = ? and address_seq = ?`;

    pool.query(
      sql,
      [
        name,
        receiver,
        address,
        phonenumber,
        is_default,
        user_seq,
        new Date(),
        user_seq,
        address_seq,
      ],
      (err, result) => {
        if (err) console.log(err);

        if (result) {
          res.status(200).json({
            message: "주소록 수정 성공",
          });
        } else {
          res.status(401).json({
            message: "주소록 수정 실패",
          });
        }
      }
    );
  }
}

// 주소록 가져오기
async function getAddressBook(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "유저 정보를 입력해주세요.",
    });
  } else {
    const sql = `select * from user_address_book where user_seq = ?`;

    pool.query(sql, user_seq, (err, results) => {
      if (err) console.log(err);

      if (results.length === 0) {
        res.status(401).json({
          message: "주소록이 없습니다.",
        });
      } else {
        res.status(200).json({
          message: "주소록 조회 성공",
          addressBook: results,
        });
      }
    });
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
};
