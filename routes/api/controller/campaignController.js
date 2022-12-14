import pool from "./../../../config/dbpool.js";
import { sendMail } from "./../../../config/mailPoster.js";
// import { sign, verify, refresh, refreshVerify } from "./../../../util/jwt-util.js";

const dbpool = await pool;

let pagelimit = 20;

// 전체 캠페인 가져오기
async function getAllCampaign(req, res, next) {
  try {
    const sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
    from campaign as c 
      left join (select campaign_seq,count(*) as count 
        from campaign_application group by campaign_seq) as cc 
      on c.campaign_seq = cc.campaign_seq
	  order by
      case 
      when timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
      then 1
      else 2
      end;`;
    const qna_sql = `select * from campaign_qna`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext
    from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign`;

    const results = await dbpool.query(sql);
    let campaign = results[0];

    for (let i = 0; i < results[0].length; i++) {
      let campaign_seq = results[0][i].campaign_seq;

      const img_results = await dbpool.query(img_sql, [campaign_seq]);
      const applicatn_sql = await dbpool.query(applicant_sql, [campaign_seq]);
      const qna_results = await dbpool.query(qna_sql, [campaign_seq]);

      // 캠페인 QnA 추가
      campaign[i]["qna"] = qna_results[0];
      // 캠페인 키워드 파싱 후 추가
      // campaign[i].keyword = results[0][i].keyword.split(",");
      // 캠페인 이미지 파일 추가
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicatn_sql[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 전체 가져오기 성공",
      campaigns: campaign,
      totalcount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 전체 가져오기 실패",
    });
  }
}

// 전체 최신순 캠페인 + 페이징
async function getAllCampaignBylastest(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                          left join
                          (select campaign_seq,count(*) as count
                            from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          order by
                            (case 
                              when timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                                then 1
                              else 2
                            end), recruit_start_date desc limit ? offset ?`;

    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];
    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 전체 인기순 캠페인 + 페이징
async function getAllCampaignByPopular(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;

    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                          left join
                          (select campaign_seq,count(*) as count
                            from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          order by
                            (case 
                              when timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                                then 1
                              else 2
                            end), applicant_count desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 전체 선정마감순 캠페인 + 페이징
async function getAllCampaignBySelection(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                          left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          order by
                            (case 
                              when timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                                then 1
                              else 2
                            end), recruit_end_date asc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 특정 캠페인 가져오기
async function getCampaign(req, res, next) {
  const { campaign_seq } = req.query;

  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, extraImageURL, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL from campaign as c left join (select campaign_seq,count(*) as count from campaign_application group by campaign_seq) as cc on c.campaign_seq = cc.campaign_seq where c.campaign_seq = ?`;
      const qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const results = await dbpool.query(sql, [campaign_seq]);
      const qna_results = await dbpool.query(qna_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

      let campaign = results[0][0];

      if (campaign) {
        campaign["campaign_file"] = img_results[0];
        campaign["qna"] = qna_results[0];
        // campaign.keyword = results[0][0].keyword.split(",");
        campaign["applicant"] = applicant_results[0];

        res.status(200).json({
          message: "특정 캠페인 가져오기 성공",
          campaign: campaign,
        });
      } else {
        res.status(400).json({
          message: "캠페인 정보가 없습니다.",
        });
      }
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "캠페인 가져오기 실패",
      });
    }
  }
}

// 캠페인 등록
async function createCampaign(req, res, next) {
  const {
    advertiser,
    is_premium,
    title,
    category,
    product,
    channel,
    area,
    address,
    keyword,
    headcount,
    siteURL,
    misson,
    reward,
    original_price,
    discount_price,
    accrual_point,
    campaign_guide,
    recruit_start_date,
    recruit_end_date,
    reviewer_announcement_date,
    review_start_date,
    review_end_date,
    campaign_end_date,
    agreement_portrait,
    agreement_provide_info,
    user_seq,
    qna,
    extraImageURL,
  } = req.body;

  if (
    advertiser === undefined ||
    is_premium === undefined ||
    title === undefined ||
    category === undefined ||
    product === undefined ||
    channel === undefined ||
    area === undefined ||
    address === undefined ||
    keyword === undefined ||
    headcount === undefined ||
    siteURL === undefined ||
    misson === undefined ||
    reward === undefined ||
    original_price === undefined ||
    discount_price === undefined ||
    accrual_point === undefined ||
    campaign_guide === undefined ||
    recruit_start_date === undefined ||
    recruit_end_date === undefined ||
    reviewer_announcement_date === undefined ||
    review_start_date === undefined ||
    review_end_date === undefined ||
    campaign_end_date === undefined ||
    agreement_portrait === undefined ||
    agreement_provide_info === undefined ||
    user_seq === undefined ||
    extraImageURL === undefined
  ) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `insert into campaign (advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, extraImageURL, first_register_id, first_register_date, last_register_id, last_register_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const qna_sql = `insert into campaign_qna (question, answer, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.beginTransaction();

      const result = await dbpool.execute(campaign_sql, [
        advertiser,
        is_premium,
        title,
        category,
        product,
        channel,
        area,
        address,
        keyword,
        headcount,
        siteURL,
        misson,
        reward,
        original_price,
        discount_price,
        accrual_point,
        campaign_guide,
        recruit_start_date,
        recruit_end_date,
        reviewer_announcement_date,
        review_start_date,
        review_end_date,
        campaign_end_date,
        agreement_portrait,
        agreement_provide_info,
        1,
        0,
        extraImageURL,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      if (qna !== undefined) {
        const campaign_seq =
          (await dbpool.execute("select Max(campaign_seq) as campaign_seq from campaign"))[0][0]
            .campaign_seq + 1;
        for (let i = 0; i < qna.length; i++) {
          await dbpool.execute(qna_sql, [
            campaign_seq,
            qna[i].question,
            qna[i].answer,
            user_seq,
            new Date(),
            user_seq,
            new Date(),
          ]);
        }
      }

      await dbpool.commit();

      res.status(200).json({
        message: "캠페인 등록 성공",
        insertid: result[0].insertId,
      });
    } catch (err) {
      await dbpool.rollback();
      console.error(err);

      res.status(500).json({
        message: "캠페인 등록 실패",
      });
    }
  }
}

// 캠페인 수정
async function updateCampaign(req, res, next) {
  const {
    campaign_seq,
    advertiser,
    is_premium,
    title,
    category,
    product,
    channel,
    area,
    address,
    keyword,
    headcount,
    siteURL,
    misson,
    reward,
    original_price,
    discount_price,
    accrual_point,
    campaign_guide,
    recruit_start_date,
    recruit_end_date,
    review_start_date,
    review_end_date,
    campaign_end_date,
    reviewer_announcement_date,
    agreement_portrait,
    agreement_provide_info,
    user_seq,
    qna,
    extraImageURL,
  } = req.body;

  if (
    campaign_seq === undefined ||
    advertiser === undefined ||
    is_premium === undefined ||
    title === undefined ||
    category === undefined ||
    product === undefined ||
    channel === undefined ||
    area === undefined ||
    address === undefined ||
    keyword === undefined ||
    headcount === undefined ||
    siteURL === undefined ||
    misson === undefined ||
    reward === undefined ||
    original_price === undefined ||
    discount_price === undefined ||
    accrual_point === undefined ||
    campaign_guide === undefined ||
    recruit_start_date === undefined ||
    recruit_end_date === undefined ||
    reviewer_announcement_date === undefined ||
    agreement_portrait === undefined ||
    agreement_provide_info === undefined ||
    user_seq === undefined ||
    extraImageURL === undefined
  ) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `update campaign set advertiser = ?, is_premium = ?, title = ?, category = ?, product = ?, channel = ? , area = ?, address = ?, keyword = ?, headcount = ?, siteURL = ?, misson = ?, reward = ?, original_price = ?, discount_price = ?, accrual_point = ?, campaign_guide = ?, recruit_start_date = ?, recruit_end_date = ?, reviewer_announcement_date = ?, review_start_date = ? , review_end_date = ? , campaign_end_date = ?, agreement_portrait = ?, agreement_provide_info = ?, extraImageURL = ?, last_register_id = ?, last_register_date = ? where campaign_seq = ?`;

      const qna_sql = `insert into campaign_qna (campaign_seq, question, answer, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.beginTransaction();

      await dbpool.execute(campaign_sql, [
        advertiser,
        is_premium,
        title,
        category,
        product,
        channel,
        area,
        address,
        keyword,
        headcount,
        siteURL,
        misson,
        reward,
        original_price,
        discount_price,
        accrual_point,
        campaign_guide,
        recruit_start_date,
        recruit_end_date,
        reviewer_announcement_date,
        review_start_date,
        review_end_date,
        campaign_end_date,
        agreement_portrait,
        agreement_provide_info,
        extraImageURL,
        user_seq,
        new Date(),
        campaign_seq,
      ]);

      if (qna !== undefined) {
        await dbpool.execute(`delete from campaign_qna where campaign_seq = ?`, [campaign_seq]);

        for (let i = 0; i < qna.length; i++) {
          await dbpool.execute(qna_sql, [
            campaign_seq,
            qna[i].question,
            qna[i].answer,
            user_seq,
            new Date(),
            user_seq,
            new Date(),
          ]);
        }
      }

      await dbpool.commit();

      res.status(200).json({
        message: "캠페인 수정 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.error(err);

      res.status(500).json({
        message: "캠페인 수정 실패",
      });
    }
  }
}

// 캠페인 삭제
async function deleteCampaign(req, res, next) {
  const { campaign_seq } = req.query;
  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `delete from campaign where campaign_seq = ?`;
      const qna_sql = `delete from campaign_qna where campaign_seq = ?`;

      await dbpool.beginTransaction();

      await dbpool.execute(campaign_sql, [campaign_seq]);
      await dbpool.execute(qna_sql, [campaign_seq]);

      await dbpool.commit();

      res.status(200).json({
        message: "캠페인 삭제 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.error(err);

      res.status(500).json({
        message: "캠페인 삭제 실패",
      });
    }
  }
}

// 캠페인 사진 등록
async function uploadCampaignImage(req, res, next) {
  const { campaign_seq, user_seq } = req.body;
  const { campaign_img_detail, campaign_img_thumbnail } = req.files;

  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 캠페인 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into campaign_file (campaign_seq, name, path, extension, filekey, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const delete_sql = `delete from campaign_file where campaign_seq = ?`;

      await dbpool.beginTransaction();

      await dbpool.execute(delete_sql, [campaign_seq]);

      for (let i = 0; i < campaign_img_detail.length; i++) {
        let filename = "detail_" + campaign_img_detail[i].originalname;
        let filepath = campaign_img_detail[i].location;
        let ext = campaign_img_detail[i].mimetype.split("/")[1];
        let key = campaign_img_detail[i].key;

        await dbpool.execute(sql, [
          campaign_seq,
          filename,
          filepath,
          ext,
          key,
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      for (let i = 0; i < campaign_img_thumbnail.length; i++) {
        let filename = "thumbnail_" + campaign_img_thumbnail[i].originalname;
        let filepath = campaign_img_thumbnail[i].location;
        let ext = campaign_img_thumbnail[i].mimetype.split("/")[1];
        let key = campaign_img_thumbnail[i].key;

        await dbpool.execute(sql, [
          campaign_seq,
          filename,
          filepath,
          ext,
          key,
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      await dbpool.commit();

      res.status(200).json({
        message: "캠페인 사진 등록 성공",
      });
    } catch (err) {
      await dbpool.rollback();
      console.error(err);

      res.status(500).json({
        message: "캠페인 사진 등록 실패",
      });
    }
  }
}

// 캠페인 사진 삭제
async function deleteCampaignImage(req, res, next) {}

// 캠페인 사진 가져오기
async function getCampaignImage(req, res, next) {
  const { campaign_seq } = req.query;
  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `select * from campaign_file where campaign_seq = ?`;

      const result = await dbpool.execute(sql, [campaign_seq]);

      res.status(200).json({
        message: "캠페인 사진 가져오기 성공",
        campaignImg: result[0],
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "캠페인 사진 가져오기 실패",
      });
    }
  }
}

// 캠페인 썸네일 이미지 수정
async function updateCampaignThumbnail(req, res, next) {
  const { file_seq, campaign_seq, user_seq } = req.body;
  const { campaign_img_thumbnail } = req.files;

  if (file_seq === undefined || campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update campaign_file set name = ?, path = ?, extension = ?, filekey = ?, last_register_id = ?, last_register_date = ? where file_seq = ? and campaign_seq = ?`;

      let filename = "thumbnail_" + campaign_img_thumbnail[0].originalname;
      let filepath = campaign_img_thumbnail[0].location;
      let ext = campaign_img_thumbnail[0].mimetype.split("/")[1];
      let key = campaign_img_thumbnail[0].key;

      await dbpool.execute(sql, [
        filename,
        filepath,
        ext,
        key,
        user_seq,
        new Date(),
        file_seq,
        campaign_seq,
      ]);

      res.status(200).json({
        message: "캠페인 썸네일 이미지 수정 성공",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "캠페인 썸네일 이미지 수정 실패",
      });
    }
  }
}
// 캠페인 상세페이지 이미지 수정
async function updateCampaignDetail(req, res, next) {
  const { file_seq, campaign_seq, user_seq } = req.body;
  const { campaign_img_detail } = req.files;

  if (file_seq === undefined || campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `update campaign_file set name = ?, path = ?, extension = ?, filekey = ?, last_register_id = ?, last_register_date = ? where file_seq = ? and campaign_seq = ?`;

      let filename = "detail_" + campaign_img_detail[0].originalname;
      let filepath = campaign_img_detail[0].location;
      let ext = campaign_img_detail[0].mimetype.split("/")[1];
      let key = campaign_img_detail[0].key;

      await dbpool.execute(sql, [
        filename,
        filepath,
        ext,
        key,
        user_seq,
        new Date(),
        file_seq,
        campaign_seq,
      ]);

      res.status(200).json({
        message: "캠페인 상세페이지 이미지 수정 성공",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "캠페인 상세페이지 이미지 수정 실패",
      });
    }
  }
}

// 진행중인 캠페인 + 페이징
async function getCampaignByProgress(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL , extraImageURL
                          from campaign as c
                            left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                            order by recruit_end_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 최신순 + 페이징
async function getCampaignByProgressBylastest(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL, extraImageURL
                          from campaign as c
                          left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                            order by recruit_start_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 인기순 + 페이징
async function getCampaignByProgressByPopular(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                            order by applicant_count desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 선정마감순 + 페이징
async function getCampaignByProgressBySelection(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0
                            order by recruit_end_date asc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 카테고리별(방문형,배송형,기자단) 캠페인 + 페이징
async function getCampaignByType(req, res, next) {
  try {
    const { page, category } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0  limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where category = ? and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql, [category]);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 최신순 + 페이징
async function getCampaignByTypeBylastest(req, res, next) {
  try {
    const { page, category } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0  order by recruit_start_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where category = ? and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_results, [category]);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 인기순 + 페이징
async function getCampaignByTypeByPopular(req, res, next) {
  try {
    const { page, category } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0  order by applicant_count desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where category = ? and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_results, [category]);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 선정마감순 + 페이징
async function getCampaignByTypeBySelection(req, res, next) {
  try {
    const { page, category } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0  order by recruit_end_date asc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where category = ? and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_results, [category]);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인(캠페인 마감일자가 지나지 않은 캠페인 중 모집마감이 되지 않은 캠페인 우선)
async function getCampaignByCampaign(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date,last_register_id, last_register_date, ifnull(cc.count,0) as applicant_count, view_count, extraImageURL 
                          from (select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, first_register_id, first_register_date, last_register_id, last_register_date, c.headcount-ifnull(r.reviewer_count,0) as reviewer_count
                                from campaign as c 
                                      left join 
                                        (select campaign_seq, count(campaign_seq) as reviewer_count
                                        from reviewer as r
                                        group by r.campaign_seq) as r 
                                      on c.campaign_seq = r.campaign_seq
                                where c.campaign_state = 1
                                order by timediff(c.recruit_end_date,now()) desc, reviewer_count desc) as c
                          left join
                                (select campaign_seq,count(*) as count
                                  from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          where campaign_state = 1
                          order by recruit_end_date desc limit ? offset ?;`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    const totalCount_results = await dbpool.query(totalCount_sql);

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// (챗봇용) 진행중인 캠페인 필터링
async function getCampaignByFilteringWithChatbot(req, res, next) {
  try {
    let { category, product, channel, area, premium } = req.body;

    let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
    let totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

    let sql_param = [];

    if (category !== undefined) {
      category = category.split(",");
      campaign_sql += ` and category in (?)`;
      totalCount_sql += ` and category in (?)`;
      sql_param.push(category);
    }

    if (product !== undefined) {
      product = product.split(",");
      campaign_sql += ` and product in (?)`;
      totalCount_sql += ` and product in (?)`;
      sql_param.push(product);
    }

    if (channel !== undefined) {
      channel = channel.split(",");
      campaign_sql += ` and channel in (?)`;
      totalCount_sql += ` and channel in (?)`;
      sql_param.push(channel);
    }

    if (area !== undefined) {
      area = area.split(",");
      campaign_sql += ` and area in (?)`;
      totalCount_sql += ` and area in (?)`;
      sql_param.push(area);
    }

    if (premium !== undefined) {
      campaign_sql += ` and is_premium = ?`;
      totalCount_sql += ` and is_premium = ?`;
      sql_param.push(premium);
    }

    console.info(campaign_sql);
    const totalCount_results = await dbpool.query(totalCount_sql, sql_param);

    const campaign_results = await dbpool.query(campaign_sql, sql_param);

    let campaign = campaign_results[0];

    // campaign + qna
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: totalCount_results[0][0].totalCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 필터링 + 페이징
async function getCampaignByFiltering(req, res, next) {
  try {
    let { page, category, product, channel, area, premium } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      let totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

      let sql_param = [];

      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` or category in (?)`;
        totalCount_sql += ` or category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        totalCount_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        totalCount_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        totalCount_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0 `;
        totalCount_sql += ` or is_premium = 0 `;
      } else {
        campaign_sql += ` or is_premium = 1 `;
        totalCount_sql += ` or is_premium = 1 `;
      }

      campaign_sql += `limit ? offset ?`;

      console.info(campaign_sql);
      const totalCount_results = await dbpool.query(totalCount_sql, sql_param);

      sql_param.push(pagelimit);
      sql_param.push(offset);

      const campaign_results = await dbpool.query(campaign_sql, sql_param);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 필터링 최신순 + 페이징
async function getCampaignByFilteringBylastest(req, res, next) {
  try {
    let { page, category, product, channel, area, premium } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      let totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

      let sql_param = [];
      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` or category in (?)`;
        totalCount_sql += ` or category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        totalCount_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        totalCount_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        totalCount_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0`;
        totalCount_sql += ` or is_premium = 0`;
      } else {
        campaign_sql += ` or is_premium = 1`;
        totalCount_sql += ` or is_premium = 1`;
      }

      campaign_sql += `order by recruit_start_date desc limit ? offset ?`;

      const totalCount_results = await dbpool.query(totalCount_sql, sql_param);

      sql_param.push(pagelimit);
      sql_param.push(offset);

      const campaign_results = await dbpool.query(campaign_sql, sql_param);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 필터링 인기순 + 페이징
async function getCampaignByFilteringByPopular(req, res, next) {
  try {
    let { page, category, product, channel, area, premium } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      let totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

      let sql_param = [];
      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` or category in (?)`;
        totalCount_sql += ` or category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        totalCount_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        totalCount_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        totalCount_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0`;
        totalCount_sql += ` or is_premium = 0`;
      } else {
        campaign_sql += ` or is_premium = 1`;
        totalCount_sql += ` or is_premium = 1`;
      }

      campaign_sql += `order by applicant_count desc limit ? offset ?`;

      const totalCount_results = await dbpool.query(totalCount_sql, sql_param);

      sql_param.push(pagelimit);
      sql_param.push(offset);

      const campaign_results = await dbpool.query(campaign_sql, sql_param);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 필터링 선정마감순 + 페이징
async function getCampaignByFilteringBySelection(req, res, next) {
  try {
    let { page, category, product, channel, area, premium } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      let totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0`;

      let sql_param = [];
      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` and category in (?)`;
        totalCount_sql += ` and category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        totalCount_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        totalCount_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        totalCount_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0`;
      } else {
        campaign_sql += ` or is_premium = 1`;
      }

      campaign_sql += `order by recruit_end_date asc limit ? offset ?`;

      const totalCount_results = await dbpool.query(totalCount_sql, sql_param);

      sql_param.push(pagelimit);
      sql_param.push(offset);

      const campaign_results = await dbpool.query(campaign_sql, sql_param);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 프리미엄 캠페인 + 페이징
async function getPremiumCampaign(req, res, next) {
  try {
    let { page } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1 order by recruit_end_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 프리미엄 캠페인 최신순 + 페이징
async function getPremiumCampaignBylastest(req, res, next) {
  try {
    let { page } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1 order by recruit_start_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 프리미엄 캠페인 인기순 + 페이징
async function getPremiumCampaignByPopular(req, res, next) {
  try {
    let { page } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1 order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 프리미엄 캠페인 선정마감순 + 페이징
async function getPremiumCampaignBySelection(req, res, next) {
  try {
    let { page } = req.query;

    if (page === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where campaign_state = 1 and timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1 order by recruit_end_date asc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and is_premium = 1`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 채널별 캠페인 + 페이징
async function getCampaignByChannel(req, res, next) {
  try {
    let { page, channel } = req.query;

    if (page === undefined || channel === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ? limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [channel]);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 채널별 최신순 캠페인 + 페이징
async function getCampaignByChannelBylastest(req, res, next) {
  try {
    let { page, channel } = req.query;

    if (page === undefined || channel === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ? order by recruit_start_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [channel]);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 채널별 인기순 캠페인 + 페이징
async function getCampaignByChannelByPopular(req, res, next) {
  try {
    let { page, channel } = req.query;

    if (page === undefined || channel === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ? order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [channel]);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 채널별 선정 마감순 캠페인 + 페이징
async function getCampaignByChannelBySelection(req, res, next) {
  try {
    let { page, channel } = req.query;

    if (page === undefined || channel === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ? order by recurit_end_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and channel = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_results, [channel]);

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 연관 캠페인 + 페이징
async function getCampaignByRelation(req, res, next) {
  try {
    let { product, filter } = req.query;

    if (product === undefined || filter === undefined) {
      res.status(400).json({
        message: "상품 정보가 없습니다.",
      });
    } else {
      let campaign_sql = "";

      if (filter === "false") {
        campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
      from campaign as c
       left join
        (select campaign_seq,count(*) as count
          from campaign_application group by campaign_seq) as cc
        on c.campaign_seq = cc.campaign_seq
        where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and c.product = ? limit 10`;
      } else {
        campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
        from campaign as c
         left join
          (select campaign_seq,count(*) as count
            from campaign_application group by campaign_seq) as cc
          on c.campaign_seq = cc.campaign_seq
          where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and c.product = ? and is_premium = 0 limit 10`;
      }
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [product]);

      let campaign = campaign_results[0];
      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "연관 캠페인 조회 성공",
        campaigns: campaign,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "연관 캠페인 조회 실패",
    });
  }
}

// 캠페인 검색 + 페이징
async function getCampaignBySearch(req, res, next) {
  try {
    let { page, search } = req.query;

    if (page === undefined || search === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?) order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?)`;

      const campaign_results = await dbpool.query(campaign_sql, [
        search,
        search,
        pagelimit,
        offset,
      ]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [search, search]);

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 검색 실패",
    });
  }
}

// 캠페인 검색 + 페이징 최신순
async function getCampaignBySearchBylastest(req, res, next) {
  try {
    let { page, search } = req.query;

    if (page === undefined || search === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?) order by recruit_start_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?)`;

      const campaign_results = await dbpool.query(campaign_sql, [
        search,
        search,
        pagelimit,
        offset,
      ]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [search, search]);

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 검색 실패",
    });
  }
}

// 캠페인 검색 + 페이징 인기순
async function getCampaignBySearchByPopular(req, res, next) {
  try {
    let { page, search } = req.query;

    if (page === undefined || search === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?) order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?)`;

      const campaign_results = await dbpool.query(campaign_sql, [
        search,
        search,
        pagelimit,
        offset,
      ]);

      let campaign = campaign_results[0];
      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [search, search]);

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 검색 실패",
    });
  }
}

// 캠페인 검색 + 페이징 선정마감순
async function getCampaignBySearchBySelection(req, res, next) {
  try {
    let { page, search } = req.query;

    if (page === undefined || search === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count, view_count, extraImageURL
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?) order by recruit_end_date asc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.user_seq, ca.campaign_seq, ca.acquaint_content, ca.select_reward, ca.camera_code, ca.face_exposure, ca.address, ca.receiver, ca.receiver_phonenumber, ca.joint_blog, ca.other_answers, ca.status, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.grade,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;
      const totalCount_sql = `select count(*) as totalCount from campaign where timediff(recruit_start_date, now()) <= 0 and timediff(now(), recruit_end_date) <= 0 and (title regexp ? or keyword regexp ?)`;

      const campaign_results = await dbpool.query(campaign_sql, [
        search,
        search,
        pagelimit,
        offset,
      ]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        // campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      const totalCount_results = await dbpool.query(totalCount_sql, [search, search]);

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: totalCount_results[0][0].totalCount,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 검색 실패",
    });
  }
}

// 캠페인 신청
async function applyCampaign(req, res, next) {
  try {
    // 캠페인 신청 정보
    // 캠페인 시퀀스, 유저 시퀀스, 내용숙지여부, 선택리워드, 얼굴노출여부, 공동블로그, 카메라 코드
    const {
      campaign_seq,
      user_seq,
      acquaint_content,
      select_reward,
      address,
      receiver,
      receiver_phonenumber,
      other_answers,
      face_exposure,
      joint_blog,
      camera_code,
    } = req.body;

    if (
      campaign_seq === undefined ||
      user_seq === undefined ||
      acquaint_content === undefined ||
      select_reward === undefined ||
      address === undefined ||
      receiver === undefined ||
      receiver_phonenumber === undefined ||
      other_answers === undefined ||
      face_exposure === undefined ||
      joint_blog === undefined ||
      camera_code === undefined
    ) {
      res.status(400).json({
        message: "캠페인 신청 정보가 없습니다.",
      });
    } else {
      const sql = `insert into campaign_application (user_seq, campaign_seq, acquaint_content, select_reward, camera_code, face_exposure, address, receiver, receiver_phonenumber,other_answers, joint_blog, status, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.query(sql, [
        user_seq,
        campaign_seq,
        acquaint_content,
        select_reward,
        camera_code,
        face_exposure,
        address,
        receiver,
        receiver_phonenumber,
        other_answers,
        joint_blog,
        0,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "캠페인 신청 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 신청 실패",
    });
  }
}

// 캠페인 신청 취소
async function cancelCampaign(req, res, next) {
  try {
    // 캠페인 신청 정보
    // 캠페인 시퀀스, 유저 시퀀스
    const { campaign_seq, user_seq } = req.body;

    if (campaign_seq === undefined || user_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `delete from campaign_application where user_seq = ? and campaign_seq = ?`;

      await dbpool.query(sql, [campaign_seq, user_seq]);

      res.status(200).json({
        message: "캠페인 신청 취소 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 신청 취소 실패",
    });
  }
}

// 특정 캠페인 신청자 목록
async function getCampaignApplicant(req, res, next) {
  try {
    // 캠페인 시퀀스
    const { campaign_seq } = req.query;

    if (campaign_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, u.grade, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
      from (select ca.campaign_seq,ca.user_seq, ca.select_reward, ca.address,ca.receiver,ca.receiver_phonenumber, ca.camera_code,joint_blog,ca.status, ca.other_answers
      from campaign_application as ca join campaign as c on ca.campaign_seq = c.campaign_seq
      where ca.campaign_seq = ?) as f join user as u on f.user_seq = u.user_seq`;

      const results = await dbpool.query(sql, [campaign_seq]);
      let campaign_applicant = results[0];

      for (let i = 0; i < campaign_applicant.length; i++)
        if (!campaign_applicant[i].other_answers === "")
          // JSON으로 Parse 없는 String일 경우 에러 발생
          campaign_applicant[i].other_answers = JSON.parse(campaign_applicant[i].other_answers);

      res.status(200).json({
        message: "특정 캠페인 신청자 목록 성공",
        applicants: campaign_applicant,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "특정 캠페인 신청자 목록 실패",
    });
  }
}

// 리뷰어 선정 등록
async function createCampaignReviewer(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스
    const { campaign_seq, user_seq, admin } = req.body;

    if (campaign_seq === undefined || user_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const applicant_sql = `select * from campaign_application where campaign_seq = ? and user_seq = ?`;

      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq, user_seq]);

      const applicant = applicant_results[0][0];

      if (applicant.status === 2 || applicant.status === 1) {
        return res.status(400).json({
          message: "이미 선정된 유저입니다.",
        });
      }
      const sql = `insert into reviewer (campaign_seq, user_seq, complete_mission, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;
      const status_sql = `update campaign_application set status = 1 where campaign_seq = ? and user_seq = ?`;
      const campaign_sql = `select * from campaign where campaign_seq = ?`;
      const user_sql = `select * from user where user_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [campaign_seq]);
      const user_results = await dbpool.query(user_sql, [user_seq]);

      const campaign = campaign_results[0][0];
      const user = user_results[0][0];

      await dbpool.beginTransaction();
      await dbpool.execute(sql, [campaign_seq, user_seq, 0, admin, new Date(), admin, new Date()]);
      await dbpool.execute(status_sql, [campaign_seq, user_seq]);
      await dbpool.commit();

      let mail_title = `[Laondeas] ${campaign.title} 캠페인 선정 안내`;
      let mail_contents = `안녕하세요 ${user.name}님!

먼저 Laondeas를 이용해주셔서 감사합니다.

신청하신 ${campaign.title} 캠페인에 선정되었습니다.

마이페이지를 통해서 선정된 캠페인을 확인하실 수 있습니다.

캠페인 바로가기 : https://www.laondeas.co.kr/product/${campaign_seq}

감사합니다.`;
      // let mail_contents = user_name+"님의 회원가입을 진심으로 축하합니다.\nLaondeas를 이용해주셔서 감사합니다.\n이제 이용하시는 모든 분들은 Laondeas의 서비스를 이용하실 수 있습니다. ";

      if (sendMail(user.email, mail_title, mail_contents)) {
        console.error(`id : ${user.id}, email : ${user.email} 메일 발송 성공`);
      } else {
        console.error(`id : ${user.id}, email : ${user.email} 메일 발송 실패`);
      }

      checkCampaignDone(campaign_seq);

      res.status(200).json({
        message: "리뷰어 선정 등록 성공",
      });
    }
  } catch (err) {
    await dbpool.rollback();
    console.error(err);

    res.status(500).json({
      message: "리뷰어 선정 등록 실패",
    });
  }
}

// 리뷰어 선정 취소
async function deleteCampaignReviewer(req, res, next) {
  try {
    // 리뷰어 시퀀스
    const { campaign_seq, user_seq } = req.body;

    if (campaign_seq === undefined || user_seq === undefined) {
      res.status(400).json({
        message: "리뷰어 정보가 없습니다.",
      });
    } else {
      const applicant_sql = `select * from campaign_application where campaign_seq = ? and user_seq = ?`;

      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq, user_seq]);

      const applicant = applicant_results[0][0];

      if (applicant.status === 2) {
        return res.status(400).json({
          message: "미션을 완료한 리뷰어는 선정을 취소할 수 없습니다.",
        });
      } else if (applicant.status === 0) {
        return res.status(400).json({
          message: "리뷰어로 선정된 회원이 아닙니다.",
        });
      }
      const sql = `delete from reviewer where campaign_seq = ? and user_seq = ?`;
      const status_sql = `update campaign_application set status = 0 where campaign_seq = ? and user_seq = ?`;

      await dbpool.beginTransaction();
      await dbpool.execute(sql, [campaign_seq, user_seq]);
      await dbpool.execute(status_sql, [campaign_seq, user_seq]);
      await dbpool.commit();

      checkCampaignDone(campaign_seq);
      res.status(200).json({
        message: "리뷰어 선정 취소 성공",
      });
    }
  } catch (err) {
    await dbpool.rollback();
    console.error(err);

    res.status(500).json({
      message: "리뷰어 선정 취소 실패",
    });
  }
}

// 특정 캠페인 리뷰어 선정자 목록
async function getCampaignReviewer(req, res, next) {
  try {
    const { campaign_seq } = req.query;

    if (campaign_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, u.grade, is_premium, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
      from (select r.campaign_seq, r.user_seq
      from reviewer as r join campaign as c on r.campaign_seq = c.campaign_seq
      where r.campaign_seq = ?) as f join user as u on f.user_seq = u.user_seq`;

      const results = await dbpool.query(sql, [campaign_seq]);

      res.status(200).json({
        message: "특정 캠페인 리뷰어 선정자 목록 성공",
        reviewers: results[0],
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "특정 캠페인 리뷰어 선정자 목록 실패",
    });
  }
}

// 캠페인 QnA 등록
async function createCampaignQnA(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스, qna
    const { campaign_seq, user_seq, qna } = req.body;

    if (campaign_seq === undefined || user_seq === undefined || qna === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `insert into campaign_qna (campaign_seq, user_seq, question, answer, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.beginTransaction();
      for (let i = 0; i < qna.length; i++) {
        let question = qna[i].question;
        let answer = qna[i].answer;

        await dbpool.execute(sql, [
          campaign_seq,
          user_seq,
          question,
          answer,
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }
      await dbpool.commit();

      res.status(200).json({
        message: "캠페인 QnA 등록 성공",
      });
    }
  } catch (err) {
    await dbpool.rollback();
    console.error(err);

    res.status(500).json({
      message: "캠페인 QnA 등록 실패",
    });
  }
}

// 캠페인 QnA 수정
async function updateCampaignQnA(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스, 질문, 응답
    const { question_seq, campaign_seq, user_seq, qna } = req.body;

    if (
      question_seq === undefined ||
      campaign_seq === undefined ||
      user_seq === undefined ||
      qna === undefined
    ) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `update campaign_qna set question = ?, answer = ?, last_register_id = ?, last_register_date = ? where campaign_seq = ? and question_seq = ?`;

      await dbpool.beginTransaction();
      for (let i = 0; i < qna.length; i++) {
        let question = qna[i].question;
        let answer = qna[i].answer;
        const result = await dbpool.execute(sql, [
          question,
          answer,
          user_seq,
          new Date(),
          campaign_seq,
          question_seq,
        ]);
      }
      res.status(200).json({
        message: "캠페인 QnA 수정 성공",
      });
    }
  } catch (err) {
    await dbpool.rollback();
    console.error(err);

    res.status(500).json({
      message: "캠페인 QnA 수정 실패",
    });
  }
}

// 캠페인 QnA 삭제
async function deleteCampaignQnA(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스, 질문, 응답
    const { campaign_seq, question_seq } = req.body;

    if (campaign_seq === undefined || question_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `delete from campaign_qna where campaign_seq = ? and question_seq = ?`;

      await dbpool.execute(sql, [campaign_seq, question_seq]);

      res.status(200).json({
        message: "캠페인 QnA 삭제 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 QnA 삭제 실패",
    });
  }
}

// 캠페인 평가 등록
async function createCampaignEvaluation(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스, 평가
    const { campaign_seq, user_seq, evaluation, content } = req.body;

    if (campaign_seq === undefined || user_seq === undefined || content === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `insert into campaign_evaluation (campaign_seq, user_seq, evaluation, content, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.execute(sql, [
        campaign_seq,
        user_seq,
        evaluation,
        content,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      res.status(200).json({
        message: "캠페인 평가 등록 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 평가 등록 실패",
    });
  }
}

// 캠페인 평가 수정
async function updateCampaignEvaluation(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스, 평가, 내용
    const { campaign_seq, user_seq, evaluation, content } = req.body;

    if (campaign_seq === undefined || user_seq === undefined || content === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `update campaign_evaluation set evaluation = ?, content = ?, last_register_id = ?, last_register_date = ? where campaign_seq = ? and user_seq = ?`;

      await dbpool.execute(sql, [
        evaluation,
        content,
        user_seq,
        new Date(),
        campaign_seq,
        user_seq,
      ]);

      res.status(200).json({
        message: "캠페인 평가 수정 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 평가 수정 실패",
    });
  }
}

// 캠페인 평가 삭제
async function deleteCampaignEvaluation(req, res, next) {
  try {
    // 캠페인 시퀀스, 유저 시퀀스, 평가, 내용
    const { campaign_seq, user_seq } = req.body;

    if (campaign_seq === undefined || user_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    } else {
      const sql = `delete from campaign_evaluation where campaign_seq = ? and user_seq = ?`;

      await dbpool.execute(sql, [campaign_seq, user_seq]);

      res.status(200).json({
        message: "캠페인 평가 삭제 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 평가 삭제 실패",
    });
  }
}

// 광고주 캠페인 정보 가져오기
async function getCampaignByAdvertiser(req, res, next) {
  try {
    const { user_seq } = req.query;

    if (user_seq === undefined) {
      res.status(400).json({
        message: "광고주 정보가 없습니다.",
      });
    } else {
      const sql = `select * from campaign where advertiser = ?`;

      const result = await dbpool.execute(sql, [user_seq]);

      res.status(200).json({
        message: "광고주 캠페인 정보 가져오기 성공",
        data: result[0],
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "광고주 캠페인 정보 가져오기 실패",
    });
  }
}

// 광고주 캠페인 신청자 목록 가져오기
async function getCampaignApplicantByAdvertiser(req, res, next) {
  try {
    const { user_seq } = req.query;

    if (user_seq === undefined) {
      res.status(400).json({
        message: "광고주 정보가 없습니다.",
      });
    } else {
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, u.grade, is_premium, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
      from
      (select ca.campaign_seq,ca.user_seq, ca.select_reward, ca.camera_code, joint_blog, ca.status, ca.other_answers, ca.address,ca.receiver,ca.receiver_phonenumber,
      from campaign_application as ca join (select * from campaign where advertiser = ?) as sec on ca.campaign_seq = sec.campaign_seq) as f join user as u on f.user_seq = u.user_seq`;

      const result = await dbpool.execute(sql, [user_seq]);
      let campaign_applicant = result[0];

      for (let i = 0; i < campaign_applicant.length; i++)
        campaign_applicant[i].other_answers = JSON.parse(campaign_applicant[i].other_answers);

      res.status(200).json({
        message: "광고주 캠페인 신청자 목록 가져오기 성공",
        data: campaign_applicant,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "광고주 캠페인 신청자 목록 가져오기 실패",
    });
  }
}

// 광고주 캠페인 리뷰어 선정자 목록 가져오기
async function getCampaignReviewerByAdvertiser(req, res, next) {
  try {
    const { user_seq } = req.query;

    if (user_seq === undefined) {
      res.status(400).json({
        message: "광고주 정보가 없습니다.",
      });
    } else {
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, u.grade, is_premium, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
      from
      (select r.campaign_seq, r.user_seq
      from reviewer as r join (select * from campaign where advertiser = ?) as sec on r.campaign_seq = sec.campaign_seq) as f join user as u on f.user_seq = u.user_seq`;

      const result = await dbpool.execute(sql, [user_seq]);

      res.status(200).json({
        message: "광고주 캠페인 리뷰어 선정자 목록 가져오기 성공",
        data: result[0],
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "광고주 캠페인 리뷰어 선정자 목록 가져오기 실패",
    });
  }
}

// // 광고주 캠페인 평가 목록 가져오기
// async function getCampaignEvaluationByAdvertiser(req, res, next) {

// }

// 미션 완료
async function missionComplete(req, res, next) {
  try {
    const { user_seq, campaign_seq, admin } = req.body;

    if (user_seq === undefined || campaign_seq === undefined || admin === undefined) {
      res.status(400).json({
        message: "필수 정보가 없습니다.",
      });
    } else {
      const reviwer_sql = `select * from campaign_application where user_seq = ? and campaign_seq = ?`;

      const reviewer_results = await dbpool.query(reviwer_sql, [user_seq, campaign_seq]);
      const reviewer = reviewer_results[0][0];

      // select값이 없으며 신청자가 아님
      if (reviewer === undefined) {
        return res.status(400).json({
          message: "캠페인 신청자가 아닙니다.",
        });
      } else if (reviewer.status === 0) {
        // 신청자이지만 리뷰어가 아닌경우
        return res.status(400).json({
          message: "해당 캠페인의 리뷰어가 아닙니다.",
        });
      } else if (reviewer.status === 2) {
        // 신청자이고 리뷰어지만 미션을 이미 완료한 경우
        return res.status(400).json({
          message: "이미 완료된 미션입니다.",
        });
      }

      const sql = `update campaign_application set status = 2 where user_seq = ? and campaign_seq = ?`;
      const review_sql = `update reviewer set complete_mission = 1 where user_seq = ? and campaign_seq = ?`;
      const campaign_sql = `select * from campaign where campaign_seq = ?`;

      // 포인트 적립
      const user_point_sql = `update user set point = point + ?, accumulated_point = accumulated_point + ? where user_seq = ?`;
      const accrual_detail_sql = `insert into accrual_detail(user_seq, accrual_point, accrual_content, accrual_point_date, first_register_id, first_register_date, last_register_id, last_register_date) values (?,?,?,now(),?,now(),?,now())`;

      // 회원 등급 조정
      const grade_count_sql = `select count(*) as count from campaign_application where user_seq = ? and status = 2`;
      const grade_count_results = await dbpool.query(grade_count_sql, [user_seq]);

      const campaign_result = await dbpool.query(campaign_sql, [campaign_seq]);

      const campaign = campaign_result[0][0];

      await dbpool.beginTransaction();

      await dbpool.execute(sql, [user_seq, campaign_seq]);

      await dbpool.execute(review_sql, [user_seq, campaign_seq]);

      await dbpool.execute(user_point_sql, [
        campaign.accrual_point,
        campaign.accrual_point,
        user_seq,
      ]);

      await dbpool.execute(accrual_detail_sql, [
        user_seq,
        campaign.accrual_point,
        `${campaign.title} 캠페인 미션 완료!`,
        admin,
        admin,
      ]);

      // 30건 이상 완료 한경우 (등급 조정 : 4 (Master))
      if (grade_count_results[0][0].count >= 30) {
        const grade_sql = `update user set grade = 4 where user_seq = ?`;
        await dbpool.execute(grade_sql, [user_seq]);
      }
      // 15건 이상 완료 한경우 (등급 조정 : 3 (Senior))
      else if (grade_count_results[0][0].count >= 15) {
        const grade_sql = `update user set grade = 3 where user_seq = ?`;
        await dbpool.execute(grade_sql, [user_seq]);
      }
      // 5건 이상 완료 한경우 (등급 조정 : 2 (Junior))
      else if (grade_count_results[0][0].count >= 5) {
        const grade_sql = `update user set grade = 2 where user_seq = ?`;
        await dbpool.execute(grade_sql, [user_seq]);
      }

      await dbpool.commit();

      checkCampaignDone(campaign_seq);
      res.status(200).json({
        message: "미션 완료 성공",
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "미션 완료 실패",
    });
  }
}

// 미션 완료 취소
async function missionCancel(req, res, next) {
  try {
    const { user_seq, campaign_seq } = req.body;

    const reviwer_sql = `select * from campaign_application where user_seq = ? and campaign_seq = ?`;

    const reviewer_results = await dbpool.query(reviwer_sql, [user_seq, campaign_seq]);
    const reviewer = reviewer_results[0][0];

    // select 결과가 없으면 신청자가 아님
    if (reviewer === undefined) {
      return res.status(400).json({
        message: "캠페인 신청자가 아닙니다.",
      });
    } else if (reviewer.status === 0) {
      // 신청자이지만 리뷰어가 아닌경우
      return res.status(400).json({
        message: "해당 캠페인의 리뷰어가 아닙니다.",
      });
    } else if (reviewer.status === 1) {
      // 신청자이고 리뷰어이지만 미션을 완료하지 않은 경우
      return res.status(400).json({
        message: "미션이 완료되지 않았습니다.",
      });
    }

    const sql = `update campaign_application set status = 1 where user_seq = ? and campaign_seq = ?`;
    const review_sql = `update reviewer set complete_mission = 0 where user_seq = ? and campaign_seq = ?`;

    const campaign_sql = `select * from campaign where campaign_seq = ?`;
    const user_point_sql = `update user set point = point - ?, accumulated_point = accumulated_point - ? where user_seq = ?`;

    const accrual_detail_sql = `delete from accrual_detail where user_seq = ? and accrual_seq = ?`;
    const detail_sql = `select * from accrual_detail where user_seq = ? and accrual_point = ? and accrual_content = ?`;

    // 회원 등급 조정
    const grade_count_sql = `select count(*) as count from campaign_application where user_seq = ? and status = 2`;
    const grade_count_results = await dbpool.query(grade_count_sql, [user_seq]);

    const campaign_result = await dbpool.execute(campaign_sql, [campaign_seq]);
    const campaign = campaign_result[0][0];

    const detail_sql_result = await dbpool.execute(detail_sql, [
      user_seq,
      campaign.accrual_point,
      `${campaign.title} 캠페인 미션 완료!`,
    ]);
    const detail = detail_sql_result[0][0];

    await dbpool.beginTransaction();

    await dbpool.execute(sql, [user_seq, campaign_seq]);
    await dbpool.execute(review_sql, [user_seq, campaign_seq]);
    await dbpool.execute(user_point_sql, [
      campaign.accrual_point,
      campaign.accrual_point,
      user_seq,
    ]);
    await dbpool.execute(accrual_detail_sql, [user_seq, detail.accrual_seq]);

    // 30건 이상 완료 한경우 (등급 조정 : 4 (Master))
    if (grade_count_results[0][0].count >= 30) {
      const grade_sql = `update user set grade = 4 where user_seq = ?`;
      await dbpool.execute(grade_sql, [user_seq]);
    }
    // 15건 이상 완료 한경우 (등급 조정 : 3 (Senior))
    else if (grade_count_results[0][0].count >= 15) {
      const grade_sql = `update user set grade = 3 where user_seq = ?`;
      await dbpool.execute(grade_sql, [user_seq]);
    }
    // 5건 이상 완료 한경우 (등급 조정 : 2 (Junior))
    else if (grade_count_results[0][0].count >= 5) {
      const grade_sql = `update user set grade = 2 where user_seq = ?`;
      await dbpool.execute(grade_sql, [user_seq]);
    }

    await dbpool.commit();

    checkCampaignDone(campaign_seq);
    res.status(200).json({
      message: "미션 완료 취소 성공",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "미션 완료 취소 실패",
    });
  }
}

// 캠페인 조회수 증가
async function increaseCampaignViewCount(req, res, next) {
  try {
    const { campaign_seq } = req.body;

    if (campaign_seq === undefined) {
      res.status(400).json({
        message: "캠페인 정보가 없습니다.",
      });
    }

    const sql = `update campaign set view_count = view_count + 1 where campaign_seq = ?`;

    await dbpool.execute(sql, [campaign_seq]);

    res.status(200).json({
      message: "캠페인 조회수 증가 성공",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "캠페인 조회수 증가 실패",
    });
  }
}

// 리뷰 등록
async function createReview(req, res, next) {
  try {
    const { user_seq, campaign_seq, review_URL, satisfaction_score, satisfaction_content } =
      req.body;

    if (
      user_seq === undefined ||
      campaign_seq === undefined ||
      review_URL === undefined ||
      satisfaction_score === undefined ||
      satisfaction_content === undefined
    ) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    } else {
      const review_sql = `select complete_mission from reviewer where user_seq = ? and campaign_seq = ?`;
      const review_results = await dbpool.execute(review_sql, [user_seq, campaign_seq]);

      if (review_results[0][0].complete_mission === 1) {
        res.status(400).json({
          message: "이미 리뷰를 등록하였습니다.",
        });
      } else {
        const sql = `update reviewer set complete_mission = 1,review_URL = ?, satisfaction_score = ?, satisfaction_content = ?, last_register_id = ?, last_register_date = ? where user_seq = ? and campaign_seq = ?`;
        const applicant_sql = `update campaign_application set status = 2 where user_seq = ? and campaign_seq = ?`;
        const campaign_sql = `select * from campaign where campaign_seq = ?`;
        // 포인트 적립
        const user_point_sql = `update user set point = point + ?, accumulated_point = accumulated_point + ? where user_seq = ?`;
        const accrual_detail_sql = `insert into accrual_detail(user_seq, accrual_point, accrual_content, accrual_point_date, first_register_id, first_register_date, last_register_id, last_register_date) values (?,?,?,now(),?,now(),?,now())`;

        // 회원 등급 조정
        const grade_count_sql = `select count(*) as count from campaign_application where user_seq = ? and status = 2`;
        const grade_count_results = await dbpool.query(grade_count_sql, [user_seq]);

        const campaign_result = await dbpool.query(campaign_sql, [campaign_seq]);

        const campaign = campaign_result[0][0];

        await dbpool.beginTransaction();
        await dbpool.execute(sql, [
          review_URL,
          satisfaction_score,
          satisfaction_content,
          user_seq,
          new Date(),
          user_seq,
          campaign_seq,
        ]);

        await dbpool.execute(applicant_sql, [user_seq, campaign_seq]);

        await dbpool.execute(user_point_sql, [
          campaign.accrual_point,
          campaign.accrual_point,
          user_seq,
        ]);

        await dbpool.execute(accrual_detail_sql, [
          user_seq,
          campaign.accrual_point,
          `${campaign.title} 캠페인 미션 완료!`,
          user_seq,
          user_seq,
        ]);

        // 30건 이상 완료 한경우 (등급 조정 : 4 (Master))
        if (grade_count_results[0][0].count >= 30) {
          const grade_sql = `update user set grade = 4 where user_seq = ?`;
          await dbpool.execute(grade_sql, [user_seq]);
        }
        // 15건 이상 완료 한경우 (등급 조정 : 3 (Senior))
        else if (grade_count_results[0][0].count >= 15) {
          const grade_sql = `update user set grade = 3 where user_seq = ?`;
          await dbpool.execute(grade_sql, [user_seq]);
        }
        // 5건 이상 완료 한경우 (등급 조정 : 2 (Junior))
        else if (grade_count_results[0][0].count >= 5) {
          const grade_sql = `update user set grade = 2 where user_seq = ?`;
          await dbpool.execute(grade_sql, [user_seq]);
        }

        await dbpool.commit();
        await checkCampaignDone(campaign_seq);

        res.status(200).json({
          message: "리뷰 등록 성공",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "리뷰 등록 실패",
    });
  }
}

// 리뷰 수정
async function updateReview(req, res, next) {
  try {
    const { user_seq, campaign_seq, review_URL, satisfaction_score, satisfaction_content } =
      req.body;

    if (
      user_seq === undefined ||
      campaign_seq === undefined ||
      review_URL === undefined ||
      satisfaction_score === undefined ||
      satisfaction_content === undefined
    ) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    } else {
      const review_sql = `select complete_mission from reviewer where user_seq = ? and campaign_seq = ?`;
      const review_results = await dbpool.execute(review_sql, [user_seq, campaign_seq]);

      if (review_results[0][0].complete_mission === 0) {
        res.status(400).json({
          message: "작성된 리뷰가 존재하지 않습니다.",
        });
      } else {
        const sql = `update reviewer set review_URL = ?, satisfaction_score = ?, satisfaction_content = ?, last_register_id = ?, last_register_date = ? where user_seq = ? and campaign_seq = ?`;

        await dbpool.execute(sql, [
          review_URL,
          satisfaction_score,
          satisfaction_content,
          user_seq,
          new Date(),
          user_seq,
          campaign_seq,
        ]);

        res.status(200).json({
          message: "리뷰 수정 성공",
        });
      }
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({});
  }
}

// 리뷰 삭제
async function deleteReview(req, res, next) {
  try {
    const { user_seq, campaign_seq } = req.body;

    if (user_seq === undefined || campaign_seq === undefined) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    } else {
      const review_sql = `select complete_mission from reviewer where user_seq = ? and campaign_seq = ?`;
      const review_results = await dbpool.execute(review_sql, [user_seq, campaign_seq]);

      if (review_results[0][0].complete_mission === 0) {
        res.status(400).json({
          message: "작성된 리뷰가 존재하지 않습니다.",
        });
      } else {
        const sql = `update reviewer set complete_mission = 0, review_URL = null, satisfaction_score = null, satisfaction_content = null, last_register_id = ?, last_register_date = ? where user_seq = ? and campaign_seq = ?`;
        const applicant_sql = `update campaign_application set status = 1 where user_seq = ? and campaign_seq = ?`;

        const campaign_sql = `select * from campaign where campaign_seq = ?`;
        const user_point_sql = `update user set point = point - ?, accumulated_point = accumulated_point - ? where user_seq = ?`;

        // const accrual_detail_sql = `delete from accrual_detail where user_seq = ? and accrual_seq = ?`;
        const accrual_detail_sql_2 = `insert into accrual_detail(user_seq, accrual_point, accrual_content, accrual_point_date, first_register_id, first_register_date, last_register_id, last_register_date) values (?,?,?,now(),?,now(),?,now())`;
        const detail_sql = `select * from accrual_detail where user_seq = ? and accrual_point = ? and accrual_content = ?`;

        // 회원 등급 조정
        const grade_count_sql = `select count(*) as count from campaign_application where user_seq = ? and status = 2`;
        const grade_count_results = await dbpool.query(grade_count_sql, [user_seq]);

        const campaign_result = await dbpool.execute(campaign_sql, [campaign_seq]);
        const campaign = campaign_result[0][0];

        // const detail_sql_result = await dbpool.execute(detail_sql, [
        //   user_seq,
        //   campaign.accrual_point,
        //   `${campaign.title} 캠페인 미션 완료!`,
        // ]);
        // const detail = detail_sql_result[0][0];

        await dbpool.beginTransaction();

        await dbpool.execute(sql, [user_seq, new Date(), user_seq, campaign_seq]);
        await dbpool.execute(applicant_sql, [user_seq, campaign_seq]);
        await dbpool.execute(user_point_sql, [
          campaign.accrual_point,
          campaign.accrual_point,
          user_seq,
        ]);

        // await dbpool.execute(accrual_detail_sql, [user_seq, detail.accrual_seq]);
        await dbpool.execute(accrual_detail_sql_2, [
          user_seq,
          campaign.accrual_point * -1,
          `${campaign.title} 캠페인 미션 취소`,
          user_seq,
          user_seq,
        ]);

        // 30건 이상 완료 한경우 (등급 조정 : 4 (Master))
        if (grade_count_results[0][0].count >= 30) {
          const grade_sql = `update user set grade = 4 where user_seq = ?`;
          await dbpool.execute(grade_sql, [user_seq]);
        }
        // 15건 이상 완료 한경우 (등급 조정 : 3 (Senior))
        else if (grade_count_results[0][0].count >= 15) {
          const grade_sql = `update user set grade = 3 where user_seq = ?`;
          await dbpool.execute(grade_sql, [user_seq]);
        }
        // 5건 이상 완료 한경우 (등급 조정 : 2 (Junior))
        else if (grade_count_results[0][0].count >= 5) {
          const grade_sql = `update user set grade = 2 where user_seq = ?`;
          await dbpool.execute(grade_sql, [user_seq]);
        }

        await dbpool.commit();

        await checkCampaignDone(campaign_seq);
        res.status(200).json({
          message: "리뷰 삭제 성공",
        });
      }
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "리뷰 삭제 실패",
    });
  }
}

// 등록된 모든 리뷰 가져오기
async function getAllReview(req, res, next) {
  try {
    const sql = `select r.user_seq, u.id, u.name, u.nickname, r.campaign_seq, c.title, c.campaign_state, r.complete_mission, r.review_URL, r.satisfaction_score, r.satisfaction_content, r.first_register_id, r.first_register_date, r.last_register_id, r.last_register_date
    from reviewer as r, user as u, campaign as c
    where r.user_seq = u.user_seq and r.campaign_seq = c.campaign_seq and r.complete_mission = 1`;

    const results = await dbpool.query(sql);
    const reviews = results[0];

    if (reviews.length === 0) {
      res.status(200).json({
        message: "등록된 리뷰가 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "리뷰 조회 성공",
        reviews,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "리뷰 조회 실패",
    });
  }
}

// 등록된 모든 리뷰 캠페인별 가져오기  (get)
// 리뷰수가 많은 순으로 먼저 보임
// Review 수가 같으면 캠페인 등록일자 기준으로 정렬
async function getAllReviewGroupByCampaign(req, res, next) {
  try {
    const campaign_sql = `select campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info,campaign_state, view_count, extraImageURL, first_register_id, first_register_date, last_register_id, last_register_date 
                          from campaign;`;

    const review_sql = `select r.user_seq, r.campaign_seq, u.id, u.name, u.nickname,  c.title, c.campaign_state, r.complete_mission, r.review_URL, r.satisfaction_score, r.satisfaction_content, r.first_register_id, r.first_register_date, r.last_register_id, r.last_register_date
                        from reviewer as r, user as u, campaign as c
                        where r.user_seq = u.user_seq and r.campaign_seq = c.campaign_seq and r.campaign_seq = ? and r.complete_mission = 1
                        order by r.last_register_date;`;

    const campaign_results = await dbpool.query(campaign_sql);
    let campaigns = campaign_results[0];

    for (let i = 0; i < campaigns.length; i++) {
      const review_results = await dbpool.query(review_sql, [campaigns[i].campaign_seq]);
      campaigns[i].reviews = review_results[0];
    }

    campaigns.sort((a, b) => {
      if (b.reviews.length == a.reviews.length)
        return b.first_register_date - a.first_register_date;

      return b.reviews.length - a.reviews.length;
    });

    if (campaigns.length === 0) {
      res.status(200).json({
        message: "등록된 리뷰가 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "리뷰 조회 성공",
        campaigns,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "리뷰 조회 실패",
    });
  }
}

// 등록된 모든 리뷰 캠페인별 가져오기 타입별(배송형,방문형,기자단,프리미엄) (get)
// 리뷰수가 많은 순으로 먼저 보임
// Review 수가 같으면 캠페인 등록일자 기준으로 정렬
async function getAllReviewGroupByCampaignByCategory(req, res, next) {
  try {
    const { category } = req.query;
    const campaign_sql = `select campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info,campaign_state, view_count, extraImageURL, first_register_id, first_register_date, last_register_id, last_register_date 
                          from campaign
                          where category = ?;`;

    const review_sql = `select r.user_seq, r.campaign_seq, u.id, u.name, u.nickname,  c.title, c.campaign_state, r.complete_mission, r.review_URL, r.satisfaction_score, r.satisfaction_content, r.first_register_id, r.first_register_date, r.last_register_id, r.last_register_date
                        from reviewer as r, user as u, campaign as c
                        where r.user_seq = u.user_seq and r.campaign_seq = c.campaign_seq and r.campaign_seq = ? and r.complete_mission = 1
                        order by r.last_register_date;`;

    const campaign_results = await dbpool.query(campaign_sql, [category]);
    let campaigns = campaign_results[0];

    for (let i = 0; i < campaigns.length; i++) {
      const review_results = await dbpool.query(review_sql, [campaigns[i].campaign_seq]);
      campaigns[i].reviews = review_results[0];
    }

    campaigns.sort((a, b) => {
      if (b.reviews.length == a.reviews.length)
        return b.first_register_date - a.first_register_date;

      return b.reviews.length - a.reviews.length;
    });

    if (campaigns.length === 0) {
      res.status(200).json({
        message: "등록된 리뷰가 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "리뷰 조회 성공",
        campaigns,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "리뷰 조회 실패",
    });
  }
}

// 상세 리뷰 가져오기
async function getReviewDetail(req, res, next) {
  try {
    const { user_seq, campaign_seq } = req.query;

    if (user_seq === undefined || campaign_seq === undefined) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    } else {
      const sql = `select r.user_seq, u.id, u.name, u.nickname, r.campaign_seq, c.title, c.campaign_state, r.complete_mission, r.review_URL, r.satisfaction_score, r.satisfaction_content, r.first_register_id, r.first_register_date, r.last_register_id, r.last_register_date
      from reviewer as r, user as u, campaign as c
      where r.user_seq = u.user_seq and r.campaign_seq = c.campaign_seq and r.user_seq = ? and r.campaign_seq = ? and r.complete_mission = 1`;

      const results = await dbpool.execute(sql, [user_seq, campaign_seq]);
      const review = results[0][0];

      if (review === undefined) {
        res.status(200).json({
          message: "등록된 리뷰가 없습니다.",
        });
      } else {
        res.status(200).json({
          message: "리뷰 조회 성공",
          review,
        });
      }
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "리뷰 상세 조회 실패",
    });
  }
}

// 유저별 등록 리뷰 가져오기
async function getReviewByUser(req, res, next) {
  try {
    const { user_seq } = req.query;

    if (user_seq === undefined) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    } else {
      const sql = `select r.user_seq, u.id, u.name, u.nickname, r.campaign_seq, c.title, c.campaign_state, r.complete_mission, r.review_URL, r.satisfaction_score, r.satisfaction_content, r.first_register_id, r.first_register_date, r.last_register_id, r.last_register_date
      from reviewer as r, user as u, campaign as c
      where r.user_seq = u.user_seq and r.campaign_seq = c.campaign_seq and r.user_seq = ? and r.complete_mission = 1`;

      const results = await dbpool.execute(sql, [user_seq]);
      const reviews = results[0];

      if (reviews.length === 0) {
        res.status(200).json({
          message: "등록된 리뷰가 없습니다.",
        });
      } else {
        res.status(200).json({
          message: "리뷰 조회 성공",
          reviews,
        });
      }
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "리뷰 조회 실패",
    });
  }
}

// 캠페인별 등록 리뷰 가져오기
async function getReviewByCampaign(req, res, next) {
  try {
    const { campaign_seq } = req.query;

    if (campaign_seq === undefined) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    } else {
      const sql = `select r.user_seq, u.id, u.name, u.nickname, r.campaign_seq, c.title, c.campaign_state, r.complete_mission, r.review_URL, r.satisfaction_score, r.satisfaction_content, r.first_register_id, r.first_register_date, r.last_register_id, r.last_register_date
      from reviewer as r, user as u, campaign as c
      where r.user_seq = u.user_seq and r.campaign_seq = c.campaign_seq and r.campaign_seq = ? and r.complete_mission = 1`;

      const results = await dbpool.execute(sql, [campaign_seq]);
      const reviews = results[0];

      if (reviews.length === 0) {
        res.status(200).json({
          message: "등록된 리뷰가 없습니다.",
        });
      } else {
        res.status(200).json({
          message: "리뷰 조회 성공",
          reviews,
        });
      }
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "리뷰 조회 실패",
    });
  }
}

// 캠페인 종료 체킹
async function checkCampaignDone(campagin_seq) {
  try {
    const sql = `select count(*) as count from reviewer where campaign_seq = ? and complete_mission = 0`;
    const result = await dbpool.execute(sql, [campagin_seq]);

    if (result[0][0].count === 0) {
      const sql = `update campaign set campaign_state = 0 where campaign_seq = ?`;
      await dbpool.execute(sql, [campagin_seq]);
    } else {
      const sql = `update campaign set campaign_state = 1 where campaign_seq = ?`;
      await dbpool.execute(sql, [campagin_seq]);
    }
  } catch (err) {
    console.error(err);
  }
}

// 조회수 기준 캠페인 가져오기
async function getCampaignByViewCount(req, res, next) {
  try {
    const { filter } = req.query;

    if (filter === undefined) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    }

    const sql = `select campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, extraImageURL, first_register_id, first_register_date, last_register_id, last_register_date
    from campaign where campaign_state = 1 order by view_count ${filter};`;

    const results = await dbpool.execute(sql);

    res.json({
      message: "조회수 기준 캠페인 조회 성공",
      campaigns: results[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "조회수 기준 캠페인 조회 실패",
    });
  }
}

// 조회수 기준 진행중인 캠페인 가져오기
async function getCampaignByProgressByViewCount(req, res, next) {
  try {
    const { filter } = req.query;

    if (filter === undefined) {
      res.status(400).json({
        message: "필수 데이터가 없습니다.",
      });
    }

    const sql = `select campaign_seq, advertiser, is_premium, title, category, product, channel, area, address, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, extraImageURL, first_register_id, first_register_date, last_register_id, last_register_date
    from campaign where campaign_state = 1 order by view_count ${filter};`;

    const results = await dbpool.execute(sql);

    res.json({
      message: "조회수 기준 진행중인 캠페인 조회 성공",
      campaigns: results[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "조회수 기준 진행중인 캠페인 조회 실패",
    });
  }
}

// xlsx download
async function xlsxDownload(req, res, next) {}

// 테스트
async function test(req, res, next) {
  try {
    /**
     * 1. 캠페인별 신청자 목록 가져오기
     * 2. 신청자 정보 가져오기
     * 3. 신청자 목록 정보로 데이터 파싱(남여 수 + 평균 / 지역 분포 수 + 평균)
     * 4. 신청자 블로그 조회수 데이터 파싱(최근 5일 방문자 + 평균)
     * 5. xlsx 파일 작성 및 저장 + 반환
     *
     */
    /**
     * xlsx 파일 생성 및 작성
     */
    // json 데이터 이용
    // const jsonData = [
    //   { name: "kim", age: 23 },
    //   { name: "park", age: 24 },
    // ];
    // const __dirname = path.resolve();
    // console.log(path.join(__dirname, "/public", "/json_to_sheet_result.xlsx"));
    // const workbook = xlsx.utils.book_new();
    // const worksheet = xlsx.utils.json_to_sheet(jsonData);
    // xlsx.utils.book_append_sheet(workbook, worksheet, "sheet1");
    // xlsx.writeFile(workbook, path.join(__dirname, "/public", "/json_to_sheet_result.xlsx"));
    // const file = __dirname + "/public/json_to_sheet_result.xlsx";
    // const filename = path.basename(file);
    // const mimetype = mime.getType(file);
    // res.setHeader("Content-disposition", "attachment; filename=" + filename);
    // res.setHeader("Content-type", mimetype);
    // const filestream = fs.createReadStream(file);
    // filestream.pipe(res);
    /**
     *  블로그 조회수 조회
     * */
    // const blog = "jungsims";
    // await axios
    //   .get(`https://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blog}`)
    //   .then(function (res, err) {
    //     // 반환값이 XML
    //     console.log(res.data);
    //     /*
    //      <?xml version="1.0" encoding="UTF-8"?>
    //         <!-- copyright(c) 2007 All rights reserved by NHN -->
    //         <!-- blog visitor count -->
    //         <visitorcnts>
    //               <visitorcnt id="20220508" cnt="105" />
    //               <visitorcnt id="20220509" cnt="92" />
    //               <visitorcnt id="20220510" cnt="88" />
    //               <visitorcnt id="20220511" cnt="118" />
    //               <visitorcnt id="20220512" cnt="84" />
    //         </visitorcnts>
    //     */
    //     // XML to JSON 변환 필요
    //     // 변환 후 방문자 목록 + 평균 -> JSON
    //   });
    // // 회원 등급 조정
    // const { user_seq } = req.query;
    // console.log(user_seq);
    // const grade_count_sql = `select count(*) as count from campaign_application where user_seq = ? and status = 2`;
    // const grade_count_results = await dbpool.query(grade_count_sql, [user_seq]);
    // console.log(grade_count_results[0][0].count);
    //만료토큰
    // const { user_seq, id } = req.query;
    // const user = { user_seq, id };
    // const accessToken = await sign(user);
    // const refreshToken = await refresh();
    // let tokensql = `insert into token values(?,?,?,?) on duplicate key update accesstoken = ?, refreshtoken = ?`;
    // await dbpool.execute(tokensql, [
    //   user_seq,
    //   id,
    //   accessToken,
    //   refreshToken,
    //   accessToken,
    //   refreshToken,
    // ]);
    // res.status(200).json({
    //   message: "로그인 성공",
    //   data: {
    //     accessToken,
    //     refreshToken,
    //   },
    // });
  } catch (err) {
    console.error(err);
  }
}

export {
  getAllCampaign,
  getAllCampaignBylastest,
  getAllCampaignByPopular,
  getAllCampaignBySelection,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  uploadCampaignImage,
  deleteCampaignImage,
  getCampaignImage,
  getCampaignByProgress,
  getCampaignByProgressBylastest,
  getCampaignByProgressByPopular,
  getCampaignByProgressBySelection,
  getCampaignByType,
  getCampaignByTypeBylastest,
  getCampaignByTypeByPopular,
  getCampaignByTypeBySelection,
  getCampaignByFilteringWithChatbot,
  getCampaignByFiltering,
  getCampaignByFilteringBylastest,
  getCampaignByFilteringByPopular,
  getCampaignByFilteringBySelection,
  getCampaignByChannel,
  getCampaignByChannelBylastest,
  getCampaignByChannelByPopular,
  getCampaignByChannelBySelection,
  getCampaignByRelation,
  getCampaignBySearch,
  getCampaignBySearchBylastest,
  getCampaignBySearchByPopular,
  getCampaignBySearchBySelection,
  applyCampaign,
  cancelCampaign,
  getCampaignApplicant,
  createCampaignReviewer,
  deleteCampaignReviewer,
  getCampaignReviewer,
  createCampaignQnA,
  updateCampaignQnA,
  deleteCampaignQnA,
  createCampaignEvaluation,
  updateCampaignEvaluation,
  deleteCampaignEvaluation,
  getCampaignByAdvertiser,
  getCampaignApplicantByAdvertiser,
  getCampaignReviewerByAdvertiser,
  // getCampaignEvaluationByAdvertiser,
  getPremiumCampaign,
  getPremiumCampaignBylastest,
  getPremiumCampaignByPopular,
  getPremiumCampaignBySelection,
  missionComplete,
  missionCancel,
  increaseCampaignViewCount,
  updateCampaignDetail,
  updateCampaignThumbnail,
  createReview,
  updateReview,
  deleteReview,
  getAllReview,
  getAllReviewGroupByCampaign,
  getAllReviewGroupByCampaignByCategory,
  getReviewDetail,
  getReviewByUser,
  getReviewByCampaign,
  getCampaignByViewCount,
  getCampaignByProgressByViewCount,
  getCampaignByCampaign,

  //test,
};
