import pool from "./../../../config/dbpool.js";

const dbpool = await pool;

// 광고 신청 등록
async function createAdvertise(req, res, next) {
  let { company_name, contact, area, isagency, agreement_info } = req.body;

  if (
    company_name === undefined ||
    contact === undefined ||
    area === undefined ||
    isagency === undefined ||
    agreement_info === undefined
  ) {
    res.status(400).json({
      message: "광고 신청 등록 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql =
        "Insert into advertisement (company_name, contact, area, isagency, agreement_info, first_register_date, last_register_date) values (?, ?, ?, ?, ?, ?, ?)";

      const results = await dbpool.execute(sql, [
        company_name,
        contact,
        area,
        isagency,
        agreement_info,
        new Date(),
        new Date(),
      ]);

      res.status(200).json({
        message: "광고 신청 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "광고 신청 등록 실패",
      });
    }
  }
}

// 광고 신청 목록 가져오기
async function getAdvertiseList(req, res, next) {
  try {
    const sql = "Select * from advertisement";
    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "광고 신청 목록 가져오기 성공",
      advertise: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "광고 신청 목록 가져오기 실패",
    });
  }
}

export { createAdvertise, getAdvertiseList };
