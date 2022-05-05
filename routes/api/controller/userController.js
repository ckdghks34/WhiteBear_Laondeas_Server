import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./../../../config/dbpool.js";
import { s3, Bucket } from "./../../../util/s3.js";
dotenv.config();

const dbpool = await pool;

// 전체 유저 조회하기
async function getAllUser(req, res, next) {
  try {
    const sql = `select * from user`;
    const userimgsql = `select * from user_file where user_seq = ?`;

    let results = await dbpool.query(sql);

    for (let i = 0; i < results[0].length; i++) {
      results[0][i].password = undefined;

      const imgresult = await dbpool.query(userimgsql, results[0][i].user_seq);

      if (imgresult[0].length !== 0) results[0][i]["profile_img"] = imgresult[0][i].path;
    }

    res.status(200).json({
      message: "전체 유저 조회 성공",
      users: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "유저 정보 조회 실패",
    });
  }
}

// 특정 유저 조회하기
async function getUser(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "유저 정보 조회 실패 , 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from user where user_seq = ?`;
      const userimgsql = `select * from user_file where user_seq = ?`;

      const results = await dbpool.query(sql, user_seq);

      const userimgResult = await dbpool.query(userimgsql, user_seq);

      let user = results[0][0];

      if (results[0].length == 0) {
        res.status(401).json({
          message: "존재하지 않는 유저입니다.",
        });
      } else {
        user.password = undefined;
        if (userimgResult[0].length !== 0) user["profile_img"] = userimgResult[0][0].path;

        res.status(200).json({
          message: "유저 정보 조회 성공",
          user: results[0][0],
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "유저 정보 조회 실패",
      });
    }
  }
}

// 기본회원정보 수정
async function updateUser(req, res, next) {
  const { user_seq, name, gender, birth, nickname, email, phonenumber } = req.body;

  if (
    user_seq === undefined ||
    name === undefined ||
    gender === undefined ||
    birth === undefined ||
    nickname === undefined ||
    phonenumber === undefined
  ) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set name = ?, gender = ?, birth = ?, nickname = ?, phonenumber = ? where user_seq = ?`;

      await dbpool.execute(sql, [name, gender, birth, nickname, phonenumber, user_seq]);

      res.status(200).json({
        message: "기본 회원 정보 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "기본 회원 정보 수정 실패",
      });
    }
  }
}

// 부가 정보 수정
async function updateAdditionalInfo(req, res, next) {
  const { user_seq, interest, area, channel } = req.body;

  if (
    user_seq === undefined ||
    blog === undefined ||
    instagram === undefined ||
    influencer === undefined ||
    youtube === undefined
  ) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      await dbpool.beginTransaction();
      // 관심사 정보 수정
      let delete_sql = `delete from user_interest where user_seq = ?`;
      await dbpool.execute(delete_sql, [user_seq]);

      for (let i = 0; i < interest.length; i++) {
        const sql = `insert into user_interest(user_interest_code, user_seq, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

        await dbpool.execute(sql, [
          user_seq,
          interest[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      // 지역 정보 수정
      delete_sql = `delete from user_area where user_seq = ?`;
      await dbpool.execute(delete_sql, [user_seq]);

      for (let i = 0; i < area.length; i++) {
        const sql = `insert into user_area(user_area_code, user_seq, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

        await dbpool.execute(sql, [user_seq, area[i], user_seq, new Date(), user_seq, new Date()]);
      }

      // 채널 정보 수정
      delete_sql = `delete from user_channel where user_seq = ?`;
      await dbpool.execute(delete_sql, [user_seq]);

      for (let i = 0; i < channel.length; i++) {
        const sql = `insert into user_channel(user_channel_code, user_seq, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

        await dbpool.execute(sql, [
          user_seq,
          channel[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }
      dbpool.commit();

      res.status(200).json({
        message: "부가 회원 정보 수정 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
        message: "부가 정보 수정 실패",
      });
    }
  }
}

// 부가정보 가져오기
async function getAdditionalInfo(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const interest_sql = `SELECT ui.user_seq, ui.user_interest_code, ct.code_name, ui.first_register_id, ui.first_register_date FROM user_interest as ui join code_table as ct on ui.user_interest_code = ct.code_value where user_seq = ?`;

      const area_sql = `SELECT ua.user_seq, ua.user_area_code, ct.code_name, ua.first_register_id, ua.first_register_date FROM user_area as ua join code_table as ct on ua.user_area_code = ct.code_value where user_seq = ?`;

      const channel_sql = `SELECT uc.user_seq, uc.user_channel_code, ct.code_name, uc.first_register_id, uc.first_register_date FROM user_channel as uc join code_table as ct on uc.user_channel_code = ct.code_value where user_seq = ?`;

      const interest_result = await dbpool.query(interest_sql, [user_seq]);
      const area_result = await dbpool.query(area_sql, [user_seq]);
      const channel_result = await dbpool.query(channel_sql, [user_seq]);

      let additionalInfo = [];

      additionalInfo["interest"] = interest_result[0];
      additionalInfo["area"] = area_result[0];
      additionalInfo["channel"] = channel_result[0];

      res.status(200).json({
        message: "부가 회원 정보 가져오기 성공",
        additionalInfo: additionalInfo,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "유저 정보 조회 실패",
      });
    }
  }
}

// URL정보 수정
async function updateSNSInfo(req, res, next) {
  const { user_seq, blog, instagram, influencer, youtube } = req.body;

  if (
    user_seq === undefined ||
    blog === undefined ||
    instagram === undefined ||
    influencer === undefined ||
    youtube === undefined
  ) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set blog = ? , instagram = ? , influencer = ? , youtube = ? , last_register_date = ? where user_seq = ?`;

      await dbpool.execute(sql, [blog, instagram, influencer, youtube, new Date(), user_seq]);

      res.status(200).json({
        message: "부가정보 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "부가 정보 수정 실패",
      });
    }
  }
}

// 비밀번호 수정
async function updatePassword(req, res, next) {
  const { user_seq, password } = req.body;

  if (user_seq === undefined || password === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = "update user set password = ?, last_register_date = ? where user_seq = ?";

      const new_password = bcrypt.hashSync(password, 10);

      await dbpool.execute(sql, [new_password, new Date(), user_seq]);

      res.status(200).json({
        message: "비밀번호 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "비밀번호 수정 실패",
      });
    }
  }
}

// 프로필 사진 등록
async function createProfile(req, res, next) {
  const { user_seq, id } = req.body;
  const filename = req.file.originalname;
  const ext = req.file.mimetype.split("/")[1];
  const key = req.file.key;
  const filepath = req.file.location;

  try {
    // const sql = `insert into user_file(user_seq,name,path,extension,first_register_id,first_register_date,last_register_id,last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update name = ?, path = ?, extension = ?, last_register_id = ?, last_register_date = ?`;
    const sql =
      "update user set profile_name = ?, profile_path = ?, profile_ext = ?, profile_key = ? , last_register_date = ? where user_seq = ?";

    await dbpool.execute(sql, [filename, filepath, ext, key, new Date(), user_seq]);

    res.status(200).json({
      message: "프로필 사진 등록 성공",
      location: filepath,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "프로필 사진 등록 실패",
    });
  }
}

// 프로필 사진 가져오기
async function getProfile(req, res, next) {
  const { user_seq } = req.query;

  try {
    const sql = `select profile_name,profile_path,profile_ext from user where user_seq = ?`;
    const results = await dbpool.execute(sql, [user_seq]);

    res.status(200).json({
      message: "프로필 사진 가져오기 성공",
      profileImg: results[0][0].profile_path,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "프로필 사진 가져오기 실패",
    });
  }
}

// // 프로필 사진 삭제
async function deleteProfile(req, res, next) {
  const { user_seq } = req.body;

  const sql = `select profile_key from user where user_seq = ?`;

  const results = await dbpool.query(sql, [user_seq]);
  if (results[0][0].profile_key !== null) {
    const params = {
      Bucket: Bucket,
      Key: results[0][0].profile_key,
    };

    s3.deleteObject(params, async (err, data) => {
      if (err) {
        console.log(err);

        res.status(500).json({
          message: "프로필 사진 삭제 실패",
        });
      }

      const delete_sql = `update user set profile_name = null, profile_path = null, profile_ext = null, profile_key = null, last_register_date = ? where user_seq = ?`;
      try {
        await dbpool.execute(delete_sql, [new Date(), user_seq]);

        res.status(200).json({
          message: "프로필 사진 삭제 성공",
        });
      } catch (err) {
        console.log(err);

        res.status(500).json({
          message: "프로필 정보 삭제 실패",
        });
      }
    });
  } else {
    res.status(400).json({
      message: "등록된 사진이 없습니다.",
    });
  }
}

// 관심 캠페인 가져오기
async function getInterestCampaign(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select ic.user_seq, c.*
      from interest_campaign as ic join campaign as c on ic.campaign_seq = c.campaign_seq
      where user_seq = ? `;

      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "관심 캠페인 조회 성공",
        interestCampaign: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "관심 캠페인 조회 실패",
      });
    }
  }
}

// 관심 캠페인 등록
async function createInterestCampaign(req, res, next) {
  const { user_seq, campaign_seq } = req.body;

  if (user_seq === undefined || campaign_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into interest_campaign (user_seq, campaign_seq, first_register_id, first_register_date, last_register_id, last_register_date)
      values (?, ?, ?, ?, ?, ?)`;

      await dbpool.execute(sql, [
        user_seq,
        campaign_seq,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "관심 캠페인 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "관심 캠페인 등록 실패, 이미 관심 등록된 캠페인 입니다.  ",
      });
    }
  }
}

// 관심 캠페인 해제
async function deleteInterestCampaign(req, res, next) {
  const { user_seq, campaign_seq } = req.body;

  if (user_seq === undefined || campaign_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `delete from interest_campaign where user_seq = ? and campaign_seq = ?`;

      await dbpool.execute(sql, [user_seq, campaign_seq]);

      res.status(200).json({
        message: "관심 캠페인 해제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "관심 캠페인 해제 실패",
      });
    }
  }
}

// 나의 캠페인 가져오기
async function getMyCampaign(req, res, next) {
  const { user_seq } = req.body;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select ca.user_seq, c.campaign_seq, c.advertiser, c.is_premium, c.title, c.type, c.headcount, c.siteURL,c.misson,c.product,c.accrual_point,c.original_price, c.discount_price, c.campaign_guide,c.recruit_end_date,c.reviewer_announcement_date,c.campaign_seq, ca.acquaint_content, ca.select_reward, ca.status,ca.address,ca.receiver,ca.receiver_phonenumber, ca.first_register_id,ca.first_register_date
      from campaign_application as ca join campaign as c on ca.campaign_seq = c.campaign_seq
      where ca.user_seq = ?`;

      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "나의 캠페인 조회 성공",
        myCampaign: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "나의 캠페인 조회 실패",
      });
    }
  }
}

// 종료된 캠페인 가져오기
async function getEndCampaign(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select re.user_seq,re.complete_mission, c.campaign_seq, c.advertiser, c.is_premium, c.title, c.type, c.headcount, c.siteURL,c.misson,c.product,c.accrual_point,c.original_price, c.discount_price, c.campaign_guide,c.recruit_end_date,c.reviewer_announcement_date,c.campaign_seq,re.first_register_id,re.first_register_date
    from reviewer as re join campaign as c on re.campaign_seq = c.campaign_seq
    where re.user_seq = ? and c.recruit_end_date < ?`;

      const results = await dbpool.query(sql, user_seq, new Date());

      res.status(200).json({
        message: "종료된 캠페인 조회 성공",
        endcampaign: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "종료된 캠페인 조회 실패",
      });
    }
  }
}

// 출석체크
async function attendanceCheck(req, res, next) {
  const { user_seq, content } = req.body;

  if (user_seq === undefined || content === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      // 오늘 출석체크를 한적이 있는 지 체크하는 sql
      const attendancecheck_sql = `select * from attendance where user_seq = ? and datediff(first_register_date,now()) = 0`;
      const sql = `insert into attendance(user_seq, content,first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;
      const accrual_detail_sql = `insert into accrual_detail(user_seq, accrual_point, accrual_content, accrual_point_date, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?, ?, ?)`;
      const accrual_sql = `update user set point = point + 100 where user_seq = ?`;

      const attendancecheck_result = await dbpool.query(attendancecheck_sql, user_seq);

      if (attendancecheck_result[0].length === 0) {
        await dbpool.beginTransaction();

        await dbpool.execute(sql, [user_seq, content, user_seq, new Date(), user_seq, new Date()]);
        await dbpool.execute(accrual_sql, [user_seq]);
        await dbpool.execute(accrual_detail_sql, [
          user_seq,
          100,
          "출석체크",
          new Date(),
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);

        await dbpool.commit();

        res.status(200).json({
          message: "출석 체크 성공",
        });
      } else {
        await dbpool.rollback();
        res.status(400).json({
          message: "이미 출석체크를 하셨습니다.",
        });
      }
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
        message: "출석 체크 실패",
      });
    }
  }
}

// 출석 리스트 가져오기
async function getAttendanceList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select a.attendance_seq,u.user_seq, u.id, u.name, u.nickname, u.profile_name, u.profile_path, u.profile_ext, u.profile_key, a.content, a.first_register_id, a.first_register_date
      from attendance as a join user as u on a.user_seq = u.user_seq where a.user_seq = ?`;

      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "출석 리스트 조회 성공",
        attendanceList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "출석 리스트 조회 실패",
      });
    }
  }
}

// 전체 출석 리스트 가져오기
async function getAllAttendanceList(req, res, next) {
  try {
    const sql = `select a.attendance_seq,u.user_seq, u.id, u.name, u.nickname, u.profile_name, u.profile_path, u.profile_ext, u.profile_key, a.content, a.first_register_id, a.first_register_date
    from attendance as a join user as u on a.user_seq = u.user_seq`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "전체 출석 리스트 조회 성공",
      attendanceList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "전체 출석 리스트 조회 실패",
    });
  }
}

// 포인트 적립
async function accrual(req, res, next) {
  const { user_seq, accrual_point, accrual_content, admin } = req.body;

  if (user_seq === undefined || accrual_point === undefined || admin === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into accrual_detail(user_seq, accrual_point, accrual_content, accrual_point_date, first_register_id, first_register_date) values(?,?,?,?,?,?)`;
      const point_accrual_sql = `update user set point = point + ?, last_register_date = ? where user_seq = ?`;

      await dbpool.beginTransaction();

      await dbpool.execute(sql, [
        user_seq,
        accrual_point,
        accrual_content,
        new Date(),
        admin,
        new Date(),
      ]);
      await dbpool.execute(point_accrual_sql, [accrual_point, new Date(), user_seq]);

      await dbpool.commit();

      res.status(200).json({
        message: "포인트 적립 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
        message: "포인트 적립 실패",
      });
    }
  }
}

// 유저별 포인트 적립내역 가져오기
async function getUserAccrualList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select accrual_seq,u.user_seq, u.name, u.id, u.profile_name, u.profile_path, u.profile_ext, u.profile_key , accrual_point, accrual_content, accrual_point_date,ad.first_register_id, ad.first_register_date 
      from accrual_detail as ad join user as u on ad.user_seq = u.user_seq where ad.user_seq = ?`;

      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "적립 내역 조회 성공",
        accrualList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "적립 내역 조회 실패",
      });
    }
  }
}

// 전체 포인트 적립내역 가져오기
async function getAllAccrualList(req, res, next) {
  try {
    const sql = `select accrual_seq,u.user_seq, u.name, u.id, u.profile_name, u.profile_path, u.profile_ext, u.profile_key , accrual_point, accrual_content, accrual_point_date,ad.first_register_id, ad.first_register_date
    from accrual_detail as ad join user as u on ad.user_seq = u.user_seq`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "전체 적립 내역 조회 성공",
      accrualList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "적립 내역 조회 실패",
    });
  }
}

// 출금 등록
async function withdrawal(req, res, next) {
  const { user_seq, withdrawal_point, admin } = req.body;

  if (user_seq === undefined || withdrawal_point === undefined || admin === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into withdrawal_detail(user_seq,withdrawal_amount,withdrawal_date, first_register_id, first_register_date,last_register_id,last_register_date) values(?,?,?,?,?,?,?)`;
      const point_modify_sql = `update user set point = point - ? , last_register_date = ? where user_seq = ? and point >= ?`;

      await dbpool.beginTransaction();

      await dbpool.execute(sql, [
        user_seq,
        withdrawal_point,
        new Date(),
        admin,
        new Date(),
        admin,
        new Date(),
      ]);

      await dbpool.execute(point_modify_sql, [
        withdrawal_point,
        new Date(),
        user_seq,
        withdrawal_point,
      ]);

      await dbpool.commit();
      res.status(200).json({
        message: "출금 신청 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
        message: "출금 신청 실패",
      });
    }
  }
}
// 출금 신청
async function withdrawalRequest(req, res, next) {
  const { user_seq, withdrawal_point } = req.body;

  if (user_seq === undefined || withdrawal_point === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const point_sql = `select point from user where user_seq = ?`;

      const results = await dbpool.query(point_sql, user_seq);

      if (results[0][0].point < withdrawal_point) {
        res.status(400).json({
          message: "출금 금액이 잔여 포인트보다 큽니다.",
        });
      } else {
        const sql = `insert into withdrawal_request(user_seq,withdrawal_point,first_register_id, first_register_date, last_register_id, last_register_date) values(?,?,?,?,?,?)`;

        await dbpool.execute(sql, [
          user_seq,
          withdrawal_point,
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);

        res.status(200).json({
          message: "출금 신청 성공",
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "출금 신청 실패",
      });
    }
  }
}

// 유저별 출금 신청 내역 가져오기
async function getWithdrawalRequestList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from withdrawal_request where user_seq = ?`;
      const results = await dbpool.query(sql, [user_seq]);

      res.status(200).json({
        message: "유저별 출금 신청 내역 가져오기 성공",
        withdrawalRequestList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "유저별 출금 신청 내역 가져오기 실패",
      });
    }
  }
}

// 전체 유저 출금 신청 내역 가져오기
async function getAllUserWithdrawalRequestList(req, res, next) {
  try {
    const sql = `select * from withdrawal_request`;
    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "전체 유저 출금 내역 가져오기 성공",
      withdrawalRequestList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "전체 유저 출금 내역 가져오기 실패",
    });
  }
}

// 전체 유저 포인트 적립내역 가져오기
async function getAllUserAccrualList(req, res, next) {
  try {
    const sql = `select accrual_seq,u.user_seq,u.name,u.id, accrual_point,accrual_content,accrual_point_date,ad.first_register_id, ad.first_register_date 
    from accrual_detail as ad join user as u on ad.user_seq = u.user_seq`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "전체 유저 포인트 적립내역 가져오기 성공",
      accrualList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "전체 유저 포인트 적립내역 가져오기 실패",
    });
  }
}

// 전체 유저 출금내역 가져오기
async function getAllUserWithdrawalList(req, res, next) {
  try {
    const sql = `select withdrawal_seq,withdrawal_point,withdrawal_point_date,first_register_id,first_register_date from withdrawal_detail`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "전체 유저 포인트 출금내역 가져오기 성공",
      withdrawalList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "전체 유저 포인트 출금내역 가져오기 실패",
    });
  }
}

// 유저별 출금내역 가져오기
async function getUserWithdrawalList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select withdrawal_seq,withdrawal_amount,withdrawal_date,first_register_id,first_register_date from withdrawal_detail where user_seq = ?`;

      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "출금 내역 조회 성공",
        withdrawalList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "출금 내역 조회 실패",
      });
    }
  }
}

// 전체 메세지 목록 보기
async function getAllMessageList(req, res, next) {
  try {
    const sql = `select * from message`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "전체 메세지 목록 보기 성공",
      messageList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "전체 메시지 조회 실패",
    });
  }
}

// 메세지 목록 보기
async function getUserMessageList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const receive_sql = `select message_seq,content,is_read, receiver, first_register_id, first_register_date from message where receiver = ?`;
      const sned_sql = `select message_seq,content,is_read, sender, first_register_id, first_register_date from message where sender = ?`;

      const receive_results = await dbpool.query(receive_sql, user_seq);
      const send_results = await dbpool.query(sned_sql, user_seq);
      const results = {
        receiveList: receive_results[0],
        sendList: send_results[0],
      };
      res.status(200).json({
        message: "메세지 목록 조회 성공",
        messageList: results,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "메세지 목록 조회 실패",
      });
    }
  }
}

// 메세지 보내기
async function sendMessage(req, res, next) {
  const { content, sender, receiver } = req.body;

  if (content === undefined || sender === undefined || receiver === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into message (content,is_read,sender,receiver,first_register_id,first_register_date, last_register_id, last_register_date) values(?,?,?,?,?,?,?,?)`;

      await dbpool.execute(sql, [
        content,
        0,
        sender,
        receiver,
        sender,
        new Date(),
        sender,
        new Date(),
      ]);

      res.status(200).json({
        message: "메세지 전송 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "메세지 전송 실패",
      });
    }
  }
}

// 메세지 확인
async function readMessage(req, res, next) {
  const { message_seq, user_seq } = req.body;

  if (message_seq === undefined || user_seq === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update message set is_read = 1 , last_register_id = ? , last_register_date = ? where message_seq = ?`;

      await dbpool.execute(sql, [user_seq, new Date(), message_seq]);

      res.status(200).json({
        message: "메세지 확인 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "메세지 확인 실패",
      });
    }
  }
}

// 읽지 않은 메세지 갯수
async function getUnreadMessageCount(req, res, next) {
  const { user_seq } = req.query;

  if (user_id === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select count(case when is_read = 0 then 1 end) as not_read_count
      from message
      where receiver = ?
      group by is_read`;

      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "메세지 확인 성공",
        count: results[0][0].count,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "메세지 확인 실패",
      });
    }
  }
}

// 문의 등록
async function createQuestion(req, res, next) {
  const { user_seq, category, title, content } = req.body;

  if (
    user_seq === undefined ||
    category === undefined ||
    title === undefined ||
    content === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into question (author, category, title, content, first_register_id, first_register_date, last_register_id, last_register_date) values(?,?,?,?,?,?,?,?)`;

      await dbpool.execute(sql, [
        user_seq,
        category,
        title,
        content,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "문의 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "문의 등록 실패",
      });
    }
  }
}
// 답변 등록
async function createAnswer(req, res, next) {
  const { qna_seq, user_seq, title, content } = req.body;

  if (
    qna_seq === undefined ||
    user_seq === undefined ||
    title === undefined ||
    content === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into answer (qna_seq, author, title, content, first_register_id, first_register_date, last_register_id, last_register_date) values(?,?,?,?,?,?,?,?)`;

      await dbpool.execute(sql, [
        qna_seq,
        user_seq,
        title,
        content,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "답변 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "답변 등록 실패",
      });
    }
  }
}

// 문의 수정
async function updateQuestion(req, res, next) {
  const { qna_seq, title, content, user_seq } = req.body;

  if (
    qna_seq === undefined ||
    title === undefined ||
    content === undefined ||
    user_seq === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update question set title = ?, content = ?, last_register_id = ?, last_register_date = ? where qna_seq = ?`;

      await dbpool.execute(sql, [title, content, user_seq, new Date(), qna_seq]);

      res.status(200).json({
        message: "문의 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "문의 수정 실패",
      });
    }
  }
}

// 답변 수정
async function updateAnswer(req, res, next) {
  const { answer_seq, title, content, user_seq } = req.body;

  if (
    answer_seq === undefined ||
    title === undefined ||
    content === undefined ||
    user_seq === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update answer set title = ?, content = ?, last_register_id = ?, last_register_date = ? where answer_seq = ?`;

      await dbpool.execute(sql, [title, content, user_seq, new Date(), answer_seq]);

      res.status(200).json({
        message: "답변 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "답변 수정 실패",
      });
    }
  }
}

// 전체 문의 답변 리스트 가져오기
async function getQNAList(req, res, next) {
  try {
    const sql = `select q.qna_seq, q.author, q.category, q.title, q.content, q.first_register_id, q.first_register_date, a.answer_seq ,a.author as answer_author, a.title as answer_title, a.content as answer_content, a.first_register_date as answer_first_register, a.first_register_date as answer_first_register_date
  from question as q left outer join answer as a on q.qna_seq = a.qna_seq`;

    const results = await dbpool.query(sql);

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

      const question = await dbpool.query(question_sql, qna_seq);
      const answer = await dbpool.query(answer_sql, qna_seq);

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

      res.status(500).json({
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
      const sql = `select q.qna_seq, q.author, q.category, q.title, q.content, q.first_register_id, q.first_register_date, a.answer_seq ,a.author as answer_author, a.title as answer_title, a.content as answer_content, a.first_register_date as answer_first_register, a.first_register_date as answer_first_register_date
      from (select *
      from question
      where author = ?) as q join answer as a on q.qna_seq = a.qna_seq`;

      let results = await dbpool.query(sql, user_seq);

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

      res.status(500).json({
        message: "문의 정보 조회 실패",
      });
    }
  }
}

// 전체 페널티 목록 가져오기
async function getAllPenaltyList(req, res, next) {
  try {
    const sql = `select * from penalty`;

    const results = await dbpool.query(sql);

    if (results[0].length == 0) {
      res.status(200).json({
        message: "등록된 페널티가 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "페널티 목록 조회 성공",
        penalty_list: results[0],
      });
    }
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "페널티 목록 조회 실패",
    });
  }
}

// 유저 페널티 목록 가져오기
async function getPenaltyList(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다.",
    });
  } else {
    try {
      const sql = `select * from penalty where user_seq = ?`;
      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "페널티 목록 조회 성공",
        penalty: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "페널티 목록 조회 실패",
      });
    }
  }
}

// 진행 중인 페널티 목록 가져오기
async function getPenaltyProceedingList(req, res, next) {
  try {
    const sql = `select p.penalty_seq, u.user_seq, u.id,u.name,u.nickname,p.content,p.end_date,p.first_register_id,p.first_register_id,p.last_register_id,p.last_register_date
    from penalty as p join user as u on p.user_seq = u.user_seq
    where p.end_date > ?`;

    const results = await dbpool.query(sql, new Date());

    if (results[0].length == 0) {
      res.status(200).json({
        message: "등록된 페널티가 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "페널티 목록 조회 성공",
        penalty: results[0],
      });
    }
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "페널티 목록 조회 실패",
    });
  }
}

// 유저 페널티 등록
async function createPenalty(req, res, next) {
  // user_seq : 페널티 추가할 유저
  // content : 페널티 내용
  // end_date : 페널티 종료 날짜
  // admin : 페널티 추가한 유저
  const { user_seq, content, end_date, admin } = req.body;

  if (
    user_seq === undefined ||
    content === undefined ||
    end_date === undefined ||
    admin === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into penalty (user_seq, content, end_date, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.execute(sql, [
        user_seq,
        content,
        end_date,
        admin,
        new Date(),
        admin,
        new Date(),
      ]);

      res.status(200).json({
        message: "페널티 추가 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "페널티 추가 실패",
      });
    }
  }
}

// 유저 페널티 삭제
async function deletePenalty(req, res, next) {
  const { penalty_seq } = req.body;

  if (penalty_seq === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `delete from penalty where penalty_seq = ?`;

      await dbpool.execute(sql, penalty_seq);

      res.status(200).json({
        message: "페널티 삭제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "페널티 삭제 실패",
      });
    }
  }
}

// 유저 페널티 수정
async function updatePenalty(req, res, next) {
  const { penalty_seq, user_seq, content, end_date, admin } = req.body;

  if (
    penalty_seq === undefined ||
    user_seq === undefined ||
    content === undefined ||
    end_date === undefined ||
    admin === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update penalty set user_seq = ?, content = ?, end_date = ?, last_register_id = ?, last_register_date = ? where penalty_seq = ?`;

      await dbpool.execute(sql, [user_seq, content, end_date, admin, new Date(), penalty_seq]);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "페널티 수정 실패",
      });
    }
  }
}

// 주소록 등록
async function createAddressBook(req, res, next) {
  const { user_seq, name, receiver, address, phonenumber, is_default } = req.body;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into user_address_book (user_seq, name, receiver, address, phonenumber, is_default, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const default_sql = "update user_address_book set is_default = 0 where user_seq = ?";

      if (is_default === 1) {
        await dbpool.beginTransaction();

        await dbpool.execute(default_sql, user_seq);
        await dbpool.execute(sql, [
          user_seq,
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
        await dbpool.commit();
      } else {
        await dbpool.execute(sql, [
          user_seq,
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
      }

      res.status(200).json({
        message: "주소록 등록 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
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

      await dbpool.execute(sql, [user_seq, address_seq]);

      res.status(200).json({
        message: "주소록 삭제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
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
      const default_sql = "update user_address_book set is_default = 0 where user_seq = ?";

      if (is_default === 1) {
        await dbpool.beginTransaction();

        await dbpool.execute(default_sql, user_seq);
        await dbpool.execute(sql, [
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

        await dbpool.commit();
      } else {
        await dbpool.execute(sql, [
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
      }

      res.status(200).json({
        message: "주소록 수정 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
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
      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "주소록 조회 성공",
        addressBook: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "주소록 조회 실패",
      });
    }
  }
}

// 유저별 주소록 가져오기
async function getUserAddressBook(req, res, next) {
  const { user_seq } = req.query;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from user_address_book where user_seq = ?`;
      const results = await dbpool.query(sql, user_seq);

      res.status(200).json({
        message: "주소록 조회 성공",
        addressBook: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "주소록 조회 실패",
      });
    }
  }
}

// 기본 배송지 변경
async function updateDefaultAddressBook(req, res, next) {
  const { user_seq, address_seq } = req.body;

  if (user_seq === undefined || address_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      await dbpool.beginTransaction();

      const sql = `update user_address_book set is_default = 0 , last_register_id = ? , last_register_date = ? where user_seq = ?`;
      await dbpool.execute(sql, [user_seq, new Date(), user_seq]);

      const sql2 = `update user_address_book set is_default = 1 , last_register_id = ? , last_register_date = ? where user_seq = ? and address_seq = ?`;
      await dbpool.execute(sql2, [user_seq, new Date(), user_seq, address_seq]);

      await dbpool.commit();

      res.status(200).json({
        message: "기본 배송지 변경 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.log(err);

      res.status(500).json({
        message: "기본 배송지 변경 실패",
      });
    }
  }
}

// 프리미엄 신청
async function createPremiumRequest(req, res, next) {
  const { user_seq, agreement_content } = req.body;

  if (user_seq === undefined || agreement_content === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into premium_application(user_seq, agreement_content, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;

      await dbpool.execute(sql, [
        user_seq,
        agreement_content,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "프리미엄 신청 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "프리미엄 신청 실패",
      });
    }
  }
}

// 프리미엄 신청 목록
async function getPremiumRequestList(req, res, next) {
  try {
    const sql = `select pa.premium_seq,pa.user_seq,u.name,u.phonenumber,u.birth,u.gender, u.influencer,u.blog,u.instagram, u.youtube, u.address_seq, u.address, pa.agreement_content
    from premium_application as pa join (select us.user_seq,us.name,us.phonenumber,us.birth,us.gender,us.influencer,us.blog,us.instagram, us.youtube, uab.address_seq, uab.address
    from user as us join user_address_book as uab on us.user_seq = uab.user_seq
    where uab.is_default = 1) as u on pa.user_seq = u.user_seq`;
    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "프리미엄 신청 목록 조회 성공",
      premiumRequestList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "프리미엄 신청 목록 조회 실패",
    });
  }
}

// 프리미엄 신청 상세
async function getPremiumRequestDetail(req, res, next) {
  const { premium_seq } = req.query;

  if (premium_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select pa.premium_seq,pa.user_seq,u.name,u.phonenumber,u.birth,u.gender, u.influencer,u.blog,u.instagram, u.youtube, u.address_seq, u.address, pa.agreement_content
      from premium_application as pa join (select us.user_seq,us.name,us.phonenumber,us.birth,us.gender,us.influencer,us.blog,us.instagram, us.youtube, uab.address_seq, uab.address
      from user as us join user_address_book as uab on us.user_seq = uab.user_seq
      where uab.is_default = 1) as u on pa.user_seq = u.user_seq
      where pa.premium_seq = ?`;

      const results = await dbpool.query(sql, premium_seq);

      res.status(200).json({
        message: "프리미엄 신청 상세 조회 성공",
        premiumRequestDetail: results[0][0],
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "프리미엄 신청 상세 조회 실패",
      });
    }
  }
}

// 프리미엄 회원 목록
async function getPremiumUserList(req, res, next) {
  try {
    const sql = `select * from user where is_premium = 1`;
    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "프리미엄 회원 목록 조회 성공",
      premiumUserList: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "프리미엄 회원 목록 조회 실패",
    });
  }
}

// 프리미엄 회원 등록
async function createPremium(req, res, next) {
  const { user_seq, admin } = req.body;

  if (user_seq === undefined || admin === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set is_premium = 1 , last_register_date = ? where user_seq = ?`;
      await dbpool.execute(sql, [new Date(), user_seq]);

      res.status(200).json({
        message: "프리미엄 회원 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "프리미엄 회원 등록 실패",
      });
    }
  }
}

// 프리미엄 회원 해제
async function deletePremium(req, res, next) {
  const { user_seq } = req.body;
  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set is_premium = 0 , last_register_date = ? where user_seq = ?`;
      await dbpool.execute(sql, [new Date(), user_seq]);

      res.status(200).json({
        message: "프리미엄 회원 해제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "프리미엄 회원 해제 실패",
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
  getQNA,
  createQuestion,
  createAnswer,
  updateQuestion,
  updateAnswer,
  getUnreadMessageCount,
  readMessage,
  sendMessage,
  getUserMessageList,
  getInterestCampaign,
  getMyCampaign,
  attendanceCheck,
  getAttendanceList,
  getAllAttendanceList,
  accrual,
  withdrawal,
  withdrawalRequest,
  getAllUserWithdrawalRequestList,
  getWithdrawalRequestList,
  getAllUserAccrualList,
  getUserWithdrawalList,
  getUserAccrualList,
  getAllUserWithdrawalList,
  getEndCampaign,
  updateAdditionalInfo,
  updateSNSInfo,
  updatePassword,
  createPremiumRequest,
  getPremiumRequestList,
  getPremiumUserList,
  createPremium,
  deletePremium,
  createProfile,
  getProfile,
  deleteProfile,
  createInterestCampaign,
  deleteInterestCampaign,
  getAllMessageList,
  getAllPenaltyList,
  getPenaltyProceedingList,
  getAllUser,
  updateDefaultAddressBook,
  getUserAddressBook,
  getPremiumRequestDetail,
  getAdditionalInfo,
  getAllAccrualList,
};
