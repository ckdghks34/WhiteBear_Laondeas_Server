import pool from "../../config/dbpool.js";

// 광고 신청 등록
async function createAdvertise(req, res, next) {
  let { company_name, contact, area, isagency, agreement_info } = req.body;

  // isagecny의 값이 없다면 0으로 설정
  // 임시
  if (isagency === undefined) isagency = 0;

  if (company_name && contact && area && agreement_info) {
    const sql =
      "Insert into advertisement (company_name, contact, area, isagency, agreement_info, first_register_date, last_register_date) values (?, ?, ?, ?, ?, ?, ?)";

    pool.query(
      sql,
      [company_name, contact, area, isagency, agreement_info, new Date(), new Date()],
      (err, result) => {
        if (err) console.log(err);

        if (result) {
          res.status(200).json({
            message: "광고 신청 성공",
          });
        } else {
          res.status(401).json({
            message: "광고 신청 실패",
          });
        }
      }
    );
  } else {
    res.status(401).json({
      message: "광고 신청 실패, 필수 데이터가 누락되었습니다.",
    });
  }
}

// 광고 신청 목록 가져오기
async function getAdvertiseList(req, res, next) {
  const sql = "Select * from advertisement";
  pool.query(sql, (err, result) => {
    if (err) console.log(err);

    if (result) {
      res.status(200).json({
        message: "광고 신청 목록 성공",
        data: result,
      });
    } else {
      res.status(401).json({
        message: "광고 신청 목록 실패",
      });
    }
  });
}

export { createAdvertise, getAdvertiseList };
