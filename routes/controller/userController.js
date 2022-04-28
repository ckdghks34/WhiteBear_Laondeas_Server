import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "../../config/dbpool.js";
dotenv.config();

// 전체 유저 조회하기
async function getAllUser(req, res, next) {
  try {
    const sql = `select * from user`;

    const results = await pool.query(sql);

    for (let i = 0; i < results[0].length; i++) {
      results[0][i].password = undefined;
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

      const results = await pool.query(sql, user_seq);

      if (results[0].length == 0) {
        res.status(401).json({
          message: "존재하지 않는 유저입니다.",
        });
      } else {
        results[0][0].password = undefined;
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

// 기본회원정보 수정
async function updateUser(req, res, next) {
  const { user_seq, name, gender, birth, nickname, email, phonenumber } = req.body;

  if (
    user_seq === undefined ||
    name === undefined ||
    gender === undefined ||
    birth === undefined ||
    nickname === undefined ||
    email === undefined ||
    phonenumber === undefined
  ) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set name = ? and gender = ? and birth = ? and nickname = ? and email = ? and phonenumber = ? where user_seq = ?`;

      await pool.execute(sql, [name, gender, birth, nickname, email, phonenumber, user_seq]);

      res.status(200).json({
        message: "기본 회원 정보 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      // 관심사 정보 수정
      let delete_sql = `delete from user_interest where user_seq = ?`;
      await pool.execute(delete_sql, [user_seq]);

      for (let i = 0; i < interest.length; i++) {
        const sql = `insert into user_interest(user_interest_code, user_seq, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

        await pool.execute(sql, [
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
      await pool.execute(delete_sql, [user_seq]);

      for (let i = 0; i < area.length; i++) {
        const sql = `insert into user_area(user_area_code, user_seq, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

        await pool.execute(sql, [user_seq, area[i], user_seq, new Date(), user_seq, new Date()]);
      }

      // 채널 정보 수정
      delete_sql = `delete from user_channel where user_seq = ?`;
      await pool.execute(delete_sql, [user_seq]);

      for (let i = 0; i < channel.length; i++) {
        const sql = `insert into user_channel(user_channel_code, user_seq, first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

        await pool.execute(sql, [user_seq, channel[i], user_seq, new Date(), user_seq, new Date()]);
      }
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "부가 정보 수정 실패",
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
      const sql = `update user set blog = ? and instagram = ? and influencer = ? and youtube = ? where user_seq = ?`;

      await pool.execute(sql, [blog, instagram, influencer, youtube, user_seq]);

      res.status(200).json({
        message: "부가정보 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = "update user set password = ? where user_seq = ?";

      password = bcrypt.hashSync(password, process.env.salt);

      await pool.execute(sql, [password, user_seq]);

      res.status(200).json({
        message: "비밀번호 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "비밀번호 수정 실패",
      });
    }
  }
}

// 프로필 사진 등록
async function createProfile(req, res, next) {}

// 프로필 사진 가져오기
async function getProfile(req, res, next) {}

// 프로필 사진 바꾸기
async function updateProfile(req, res, next) {}

// 관심 캠페인 가져오기
async function getInterestCampaign(req, res, next) {
  const { user_seq } = req.body;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select ic.user_seq, c.*
      from interest_campaign as ic join campaign as c on ic.campaign_seq = c.campaign_seq
      where user_seq = ? `;

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "관심 캠페인 조회 성공",
        interestCampaign: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "관심 캠페인 조회 실패",
      });
    }
  }
}

// 관심 캠페인 등록
async function createInterestCampaign(req, res, next) {}

// 관심 캠페인 해제
async function deleteInterestCampaign(req, res, next) {}

// 나의 캠페인 가져오기
async function getMyCampaign(req, res, next) {
  const { user_seq } = req.body;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select ca.user_seq, c.campaign_seq, c.advertiser, c.is_premium, c.title, c.type, c.headcount, c.siteURL,c.misson,c.product,c.accrual_point,c.additional_information,c.recruit_end_date,c.reviewer_announcement_date,c.campaign_seq, ca.acquaint_content, ca.select_reward, ca.status,ca.first_register_id,ca.first_register_date
      from campaign_application as ca join campaign as c on ca.campaign_seq = c.campaign_seq
      where ca.user_seq = ?`;

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "나의 캠페인 조회 성공",
        myCampaign: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = `select re.user_seq,re.complete_mission, c.campaign_seq, c.advertiser, c.is_premium, c.title, c.type, c.headcount, c.siteURL,c.misson,c.product,c.accrual_point,c.additional_information,c.recruit_end_date,c.reviewer_announcement_date,c.campaign_seq,re.first_register_id,re.first_register_date
    from reviewer as re join campaign as c on re.campaign_seq = c.campaign_seq
    where re.user_seq = ? and c.recruit_end_date < ?`;

      const results = await pool.query(sql, user_seq, new Date());

      res.status(200).json({
        message: "종료된 캠페인 조회 성공",
        endcampaign: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = `insert into attendance(user_seq, content,first_register_id, first_register_date, last_register_id, last_register_date) values(?, ?, ?, ?, ?, ?)`;

      await pool.execute(sql, [user_seq, content]);

      res.status(200).json({
        message: "출석 체크 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "출석 체크 실패",
      });
    }
  }
}

// 출석 리스트 가져오기
async function getAttendanceList(req, res, next) {
  const { user_seq } = req.body;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from attendance where user_seq = ?`;

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "출석 리스트 조회 성공",
        attendanceList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "출석 리스트 조회 실패",
      });
    }
  }
}

// 포인트 적립
async function accrual(req, res, next) {
  const { user_seq, accrual_point, admin } = req.body;

  if (user_seq === undefined || accrual_point === undefined || admin === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into accrual_detail(user_seq,accrual_point,accrual_point_date, first_register_id, first_register_date) values(?,?,?,?,?)`;
      const point_accrual_sql = `update user set point = point + ? where user_seq = ?`;

      await pool.execute(sql, [user_seq, accrual_point, new Date(), admin, new Date()]);
      await pool.execute(point_accrual_sql, [accrual_point, user_seq]);

      res.status(200).json({
        message: "포인트 적립 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = `select accrual_seq,u.user_seq,u.name,u.id, accrual_point,accrual_point_date,ad.first_register_id, ad.first_register_date 
      from accrual_detail as ad join user as u on ad.user_seq = u.user_seq where ad.user_seq = ?`;

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "적립 내역 조회 성공",
        accrualList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "적립 내역 조회 실패",
      });
    }
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
      const point_modify_sql = `update user set point = point - ? where user_seq = ? and point >= ?`;

      await pool.execute(sql, [
        user_seq,
        withdrawal_point,
        new Date(),
        admin,
        new Date(),
        admin,
        new Date(),
      ]);

      await pool.execute(point_modify_sql, [withdrawal_point, user_seq, withdrawal_point]);

      res.status(200).json({
        message: "출금 신청 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = `insert into withdrawal_request(user_seq,withdrawal_point,first_register_id, first_register_date, last_register_id, last_register_date) values(?,?,?,?,?,?)`;

      await pool.execute(sql, [
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
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const results = await pool.query(sql, [user_seq]);

      res.status(200).json({
        message: "유저별 출금 신청 내역 가져오기 성공",
        withdrawalRequestList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "유저별 출금 신청 내역 가져오기 실패",
      });
    }
  }
}

// 전체 유저 출금 신청 내역 가져오기
async function getAllUserWithdrawalRequestList(req, res, next) {
  try {
    const sql = `select * from withdrawal_request`;
    const results = await pool.query(sql);

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
    const sql = `select accrual_seq,u.user_seq,u.name,u.id, accrual_point,accrual_point_date,ad.first_register_id, ad.first_register_date 
    from accrual_detail as ad join user as u on ad.user_seq = u.user_seq`;

    const results = await pool.query(sql);

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

// 전체 유저  출금내역 가져오기
async function getAllUserWithdrawalList(req, res, next) {
  try {
    const sql = `select withdrawal_seq,withdrawal_point,withdrawal_point_date,first_register_id,first_register_date from withdrawal_detail`;

    const results = await pool.query(sql);

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

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "출금 내역 조회 성공",
        withdrawalList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "출금 내역 조회 실패",
      });
    }
  }
}

// 전체 메세지 목록 보기
async function getAllMessageList(req, res, next) {
  try {
    const sql = `select * from message`;

    const results = await pool.query(sql);

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
      const sql = `select message_seq,content,is_read, receiver, first_register_id, first_register_date from message where user_seq = ?`;

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "메세지 목록 조회 성공",
        messageList: results[0],
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = `insert into message (content,is_read,sender,receiver,first_register_id,first_register_id, last_register_id, last_register_date) values(?,?,?,?,?,?,?,?)`;

      await pool.execute(sql, [content, 0, sender, receiver, sender, sender, sender, new Date()]);

      res.status(200).json({
        message: "메세지 전송 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "메세지 전송 실패",
      });
    }
  }
}

// 메세지 확인
async function readMessage(req, res, next) {
  const { message_seq } = req.body;

  if (message_seq === undefined) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update message set is_read = 1 where message_seq = ?`;

      await pool.execute(sql, [message_seq]);

      res.status(200).json({
        message: "메세지 확인 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "메세지 확인 실패",
      });
    }
  }
}

// notion 추가 필요
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

      const results = await pool.query(sql, user_seq);

      res.status(200).json({
        message: "메세지 확인 성공",
        count: results[0][0].count,
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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

      await pool.execute(sql, [
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

      res.status(400).json({
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
    author === undefined ||
    title === undefined ||
    content === undefined
  ) {
    res.status(400).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into answer (qna_seq, author, title, content, first_register_id, first_register_date, last_register_id, last_register_date) values(?,?,?,?,?,?,?,?)`;

      await pool.execute(sql, [
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

      res.status(400).json({
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

      await pool.execute(sql, [title, content, user_seq, new Date(), qna_seq]);

      res.status(200).json({
        message: "문의 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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

      await pool.execute(sql, [title, content, user_seq, new Date(), answer_seq]);

      res.status(200).json({
        message: "답변 수정 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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

// 전체 페널티 목록 가져오기
async function getAllPenaltyList(req, res, next) {
  try {
    const sql = `select * from penalty`;

    const results = await pool.query(sql);

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

// 진행 중인 페널티 목록 가져오기
async function getPenaltyProceedingList(req, res, next) {
  try {
    const sql = `select p.penalty_seq, u.user_seq, u.id,u.name,u.nickname,p.content,p.end_date,p.first_register_id,p.first_register_id,p.last_register_id,p.last_register_date
    from penalty as p join user as u on p.user_seq = u.user_seq
    where p.end_date > ?`;

    const results = await pool.query(sql, new Date());

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

      await pool.execute(sql, [user_seq, content, end_date, admin, new Date(), admin, new Date()]);

      res.status(200).json({
        message: "페널티 추가 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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

      await pool.execute(sql, penalty_seq);

      res.status(200).json({
        message: "페널티 삭제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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

      await pool.execute(sql, [user_seq, content, end_date, admin, new Date(), penalty_seq]);
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "페널티 수정 실패",
      });
    }
  }
}

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

      await pool.execute(sql, [
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

      res.status(400).json({
        message: "프리미엄 신청 실패",
      });
    }
  }
}

// 프리미엄 신청 목록
async function getPremiumRequestList(req, res, next) {
  try {
    const sql = `select * from premium_application`;
    const results = await pool.query(sql);

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

// 프리미엄 회원 목록
async function getPremiumUserList(req, res, next) {
  try {
    const sql = `select * from user where is_premium = 1`;
    const results = await pool.query(sql);

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
  const { user_seq } = req.body;

  if (user_seq === undefined) {
    res.status(401).json({
      message: "잘못된 접근입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update user set is_premium = 1 where user_seq = ?`;
      await pool.execute(sql, user_seq);

      res.status(200).json({
        message: "프리미엄 회원 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
      const sql = `update user set is_premium = 0 where user_seq = ?`;
      await pool.execute(sql, user_seq);

      res.status(200).json({
        message: "프리미엄 회원 해제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
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
  updateProfile,
  createInterestCampaign,
  deleteInterestCampaign,
  getAllMessageList,
  getAllPenaltyList,
  getPenaltyProceedingList,
  getAllUser,
};
