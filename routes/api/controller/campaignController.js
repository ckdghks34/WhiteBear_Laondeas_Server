import pool from "./../../../config/dbpool.js";

const dbpool = await pool;

let pagelimit = 20;

// 전체 캠페인 가져오기
async function getAllCampaign(req, res, next) {
  try {
    const sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count 
    from campaign as c 
      left join (select campaign_seq,count(*) as count 
        from campaign_application group by campaign_seq) as cc 
      on c.campaign_seq = cc.campaign_seq`;
    const qna_sql = `select * from campaign_qna`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext
    from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

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
      campaign[i].keyword = results[0][i].keyword.split(",");
      // 캠페인 이미지 파일 추가
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicatn_sql[0];
    }

    res.status(200).json({
      message: "캠페인 전체 가져오기 성공",
      campaigns: campaign,
      totalcount: campaign.length,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "캠페인 전체 가져오기 실패",
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
      const sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, first_register_id, first_register_date ,ifnull(cc.count,0) as applicant_count from campaign as c left join (select campaign_seq,count(*) as count from campaign_application group by campaign_seq) as cc on c.campaign_seq = cc.campaign_seq where c.campaign_seq = ?`;
      const qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const results = await dbpool.query(sql, [campaign_seq]);
      const qna_results = await dbpool.query(qna_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);

      let campaign = results[0][0];

      campaign["campaign_file"] = img_results[0];
      campaign["qna"] = qna_results[0];
      campaign.keyword = results[0][0].keyword.split(",");
      campaign["applicant"] = applicant_results[0];

      res.status(200).json({
        message: "특정 캠페인 가져오기 성공",
        campaign: campaign,
      });
    } catch (err) {
      console.log(err);

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
  } = req.body;

  if (
    advertiser === undefined ||
    is_premium === undefined ||
    title === undefined ||
    category === undefined ||
    product === undefined ||
    channel === undefined ||
    area === undefined ||
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
    user_seq === undefined
  ) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `insert into campaign (advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date,review_start_date, review_end_date, campaign_end_date, agreement_portrait, agreement_provide_info, campaign_state, view_count, first_register_id, first_register_date, last_register_id, last_register_date) values 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const qna_sql = `insert into campaign_qna (question, answer, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.beginTransaction();

      await dbpool.execute(campaign_sql, [
        advertiser,
        is_premium,
        title,
        category,
        product,
        channel,
        area,
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
      });
    } catch (err) {
      console.log(err);

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
    user_seq === undefined
  ) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `update campaign set advertiser = ?, is_premium = ?, title = ?, category = ?, product = ?, channel = ? , area = ?, keyword = ?, headcount = ?, siteURL = ?, misson = ?, reward = ?, original_price = ?, discount_price = ?, accrual_point = ?, campaign_guide = ?, recruit_start_date = ?, recruit_end_date = ?, reviewer_announcement_date = ?, review_start_date = ? , review_end_date = ? , campaign_end_date = ?, agreement_portrait = ?, agreement_provide_info = ?, last_register_id = ?, last_register_date = ? where campaign_seq = ?`;

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
        keyword,
        headcount,
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
      console.log(err);

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
      console.log(err);

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
  // console.log(campaign_img_detail);
  // console.log(campaign_img_thumbnail);

  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "잘못된 요청입니다. 캠페인 데이터가 없습니다.",
    });
  } else {
    try {
      const sql = `insert into campaign_file (campaign_seq, name, path, extension, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?)`;
      const delete_sql = `delete from campaign_file where campaign_seq = ?`;

      await dbpool.beginTransaction();

      await dbpool.execute(delete_sql, [campaign_seq]);

      for (let i = 0; i < campaign_img_detail.length; i++) {
        let filename = "detail_" + campaign_img_detail[i].originalname;
        let filepath = campaign_img_detail[i].location;
        let ext = campaign_img_detail[i].mimetype.split("/")[1];

        console.log(filename, filepath, ext, campaign_seq, user_seq);

        await dbpool.execute(sql, [
          campaign_seq,
          filename,
          filepath,
          ext,
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

        console.log(filename, filepath, ext, campaign_seq, user_seq);

        await dbpool.execute(sql, [
          campaign_seq,
          filename,
          filepath,
          ext,
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
      console.log(err);

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
      console.log(err);

      res.status(500).json({
        message: "캠페인 사진 가져오기 실패",
      });
    }
  }
}

// 전체 최신순 캠페인 + 페이징
async function getAllCampaignBylastest(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                          left join
                          (select campaign_seq,count(*) as count
                            from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          order by recruit_start_date desc limit ? offset ?`;

    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];
    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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

    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                          left join
                          (select campaign_seq,count(*) as count
                            from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          order by applicant_count desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                          left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                          on c.campaign_seq = cc.campaign_seq
                          order by recruit_end_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 진행중인 캠페인 + 페이징
async function getCampaignByProgress(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count 
                          from campaign as c
                            left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()
                            order by recruit_end_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                          left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()
                            order by recruit_start_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()
                            order by applicant_count desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()
                            order by recruit_end_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and recruit_start_date <= now() and recruit_end_date >= now()  limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and recruit_start_date <= now() and recruit_end_date >= now()  order by recruit_start_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and recruit_start_date <= now() and recruit_end_date >= now()  order by applicant_count desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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
    const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where category = ? and recruit_start_date <= now() and recruit_end_date >= now()  order by recruit_end_date desc limit ? offset ?`;
    const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
    const img_sql = `select * from campaign_file where campaign_seq = ?`;
    const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

    const campaign_results = await dbpool.query(campaign_sql, [category, pagelimit, offset]);

    let campaign = campaign_results[0];

    // campaign + qna / applicant
    for (let i = 0; i < campaign_results[0].length; i++) {
      let campaign_seq = campaign_results[0][i].campaign_seq;

      const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      const img_results = await dbpool.query(img_sql, [campaign_seq]);

      campaign[i]["qna"] = campaign_qna_results[0];
      campaign[i].keyword = campaign_results[0][i].keyword.split(",");
      campaign[i]["campaign_file"] = img_results[0];
      campaign[i]["applicant"] = applicant_results[0];
    }

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigns: campaign,
      totalCount: campaign.length,
    });
  } catch (err) {
    console.log(err);

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

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      let sql_param = [];

      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` or category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0 `;
      } else {
        campaign_sql += ` or is_premium = 1 `;
      }

      campaign_sql += `limit ? offset ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      let sql_param = [];
      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` or category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0`;
      } else {
        campaign_sql += ` or is_premium = 1`;
      }

      campaign_sql += `order by recruit_start_date desc limit ? offset ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      let sql_param = [];
      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` or category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0`;
      } else {
        campaign_sql += ` or is_premium = 1`;
      }

      campaign_sql += `order by applicant_count desc limit ? offset ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      let campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now()`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      let sql_param = [];
      if (category !== undefined) {
        category = category.split(",");
        campaign_sql += ` and category in (?)`;
        sql_param.push(category);
      }

      if (product !== undefined) {
        product = product.split(",");
        campaign_sql += ` or product in (?)`;
        sql_param.push(product);
      }

      if (channel !== undefined) {
        channel = channel.split(",");
        campaign_sql += ` or channel in (?)`;
        sql_param.push(channel);
      }

      if (area !== undefined) {
        area = area.split(",");
        campaign_sql += ` or area in (?)`;
        sql_param.push(area);
      }

      if (premium !== undefined) {
        campaign_sql += ` or is_premium = 0`;
      } else {
        campaign_sql += ` or is_premium = 1`;
      }

      campaign_sql += `order by recruit_end_date desc limit ? offset ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and is_premium = 1 order by recruit_end_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and is_premium = 1 order by recruit_start_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and is_premium = 1 order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and is_premium = 1 order by recruit_end_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and channel = ? limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and channel = ? order by recruit_start_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and channel = ? order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and channel = ? order by recurit_end_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

      const campaign_results = await dbpool.query(campaign_sql, [channel, pagelimit, offset]);

      let campaign = campaign_results[0];

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);
        const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
        const img_results = await dbpool.query(img_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 조회 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 연관 캠페인 + 페이징
/*
async function getCampaignByRelation(req, res, next) {
  try {
    let { page, campaign_seq } = req.query;

    if (page === undefined || campaign_seq === undefined) {
      res.status(400).json({
        message: "페이지 정보가 없습니다.",
      });
    } else {
      const offset = (page - 1) * pagelimit;

      const campaign_sql = `select campaign_seq,count(*) as count
      from campaign_application
      where campaign_seq = 1;
      
      select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count from campaign as c join (select campaign_seq,count(*) as count from campaign_application group by campaign_seq) as cc on c.campaign_seq = cc.campaign_seq order by applicant_count desc limit 1 offset 1;
      
      select fir.*
      from 
      (select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count,view_count
      from campaign as c
        join
        (select campaign_seq,count(*) as count
          from campaign_application group by campaign_seq) as cc              
        on c.campaign_seq = cc.campaign_seq
      ) as fir, (select * from campaign where campaign_seq = 1) as sec
      where true and fir.campaign_seq = ? or fir.area = sec.area or fir.category = sec.category or fir.channel = sec.channel
      limit ? offset ?;`;

      let campaign_results = await dbpool.query(campaign_sql, [campaign_seq, pagelimit, offset]);

      // campaign + qna
      for (let i = 0; i < campaign_results[0].length; i++) {
        let campaign_seq = campaign_results[0][i].campaign_seq;

        const campaign_qna_results = await dbpool.query(campaign_qna_sql, [campaign_seq]);

        campaign[i]["qna"] = campaign_qna_results[0];
        campaign[i].keyword = campaign_results[0][i].
}
*/

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and (title regexp ? or keyword regexp ?) order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and (title regexp ? or keyword regexp ?) order by recruit_start_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and (title regexp ? or keyword regexp ?) order by applicant_count desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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

      const campaign_sql = `select c.campaign_seq, advertiser, is_premium, title, category, product, channel, area, keyword, headcount, siteURL, misson, reward, original_price, discount_price, accrual_point, campaign_guide, recruit_start_date, recruit_end_date, review_start_date, review_end_date, campaign_end_date, reviewer_announcement_date, agreement_portrait, agreement_provide_info, campaign_state, first_register_id, first_register_date ,cc.count as applicant_count, view_count
                          from campaign as c
                           left join
                            (select campaign_seq,count(*) as count
                              from campaign_application group by campaign_seq) as cc
                            on c.campaign_seq = cc.campaign_seq
                            where recruit_start_date <= now() and recruit_end_date >= now() and (title regexp ? or keyword regexp ?) order by recruit_end_date desc limit ? offset ?`;
      const campaign_qna_sql = `select * from campaign_qna where campaign_seq = ?`;
      const img_sql = `select * from campaign_file where campaign_seq = ?`;
      const applicant_sql = `select ca.*, u.id, u.name,u.nickname,u.phonenumber,u.gender,u.birth,u.email,u.is_premium, u.is_advertiser,u.blog,u.instagram,u.influencer,u.youtube,u.point,u.profile_name, u.profile_path, u.profile_ext from campaign_application as ca join user as u on ca.user_seq = u.user_seq where ca.campaign_seq = ?`;

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
        campaign[i].keyword = campaign_results[0][i].keyword.split(",");
        campaign[i]["campaign_file"] = img_results[0];
        campaign[i]["applicant"] = applicant_results[0];
      }

      res.status(200).json({
        message: "캠페인 검색 성공",
        campaigns: campaign,
        totalCount: campaign.length,
      });
    }
  } catch (err) {
    console.log(err);

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
      face_exposure === undefined ||
      joint_blog === undefined ||
      camera_code === undefined
    ) {
      res.status(400).json({
        message: "캠페인 신청 정보가 없습니다.",
      });
    } else {
      const sql = `insert into campaign_application (user_seq, campaign_seq, acquaint_content, select_reward, camera_code, face_exposure, address, receiver, recevier_phonenumber, joint_blog, status, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    console.log(err);

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
    console.log(err);

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
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
      from (select ca.campaign_seq,ca.user_seq, ca.select_reward, ca.address,ca.receiver,ca.receiver_phonenumber, ca.camera_code,joint_blog,ca.status
      from campaign_application as ca join campaign as c on ca.campaign_seq = c.campaign_seq
      where ca.campaign_seq = ?) as f join user as u on f.user_seq = u.user_seq`;

      const results = await dbpool.query(sql, [campaign_seq]);

      res.status(200).json({
        message: "특정 캠페인 신청자 목록 성공",
        applicants: results[0],
      });
    }
  } catch (err) {
    console.log(err);

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
      const sql = `insert into reviewer (campaign_seq, user_seq, complete_mission, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;
      const status_sql = `update campaign_application set status = 0 where campaign_seq = ? and user_seq = ?`;

      await dbpool.beginTransaction();
      await dbpool.execute(sql, [campaign_seq, user_seq, 0, admin, new Date(), admin, new Date()]);
      await dbpool.execute(status_sql, [campaign_seq, user_seq]);
      await dbpool.commit();

      res.status(200).json({
        message: "리뷰어 선정 등록 성공",
      });
    }
  } catch (err) {
    console.log(err);

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
      const sql = `delete from reviewer where campaign_seq = ? and user_seq = ?`;

      await dbpool.query(sql, [campaign_seq, user_seq]);

      res.status(200).json({
        message: "리뷰어 선정 취소 성공",
      });
    }
  } catch (err) {
    console.log(err);

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
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, is_premium, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
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
    console.log(err);

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
    console.log(err);

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
        await dbpool.execute(sql, [
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
    console.log(err);

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
    console.log(err);

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
    console.log(err);

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
    console.log(err);

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
    console.log(err);

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
    console.log(err);

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
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, is_premium, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
      from
      (select ca.campaign_seq,ca.user_seq, ca.select_reward, ca.camera_code,joint_blog,ca.status, ca.address,ca.receiver,ca.receiver_phonenumber,
      from campaign_application as ca join (select * from campaign where advertiser = ?) as sec on ca.campaign_seq = sec.campaign_seq) as f join user as u on f.user_seq = u.user_seq`;

      const result = await dbpool.execute(sql, [user_seq]);

      res.status(200).json({
        message: "광고주 캠페인 신청자 목록 가져오기 성공",
        data: result[0],
      });
    }
  } catch (err) {
    console.log(err);

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
      const sql = `select f.*, u.id,u.name,u.phonenumber, u.gender, u.birth, is_premium, u.is_premium, u.is_advertiser, u.profile_name,u.profile_path,u.profile_ext
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
    console.log(err);

    res.status(500).json({
      message: "광고주 캠페인 리뷰어 선정자 목록 가져오기 실패",
    });
  }
}

// // 광고주 캠페인 평가 목록 가져오기
// async function getCampaignEvaluationByAdvertiser(req, res, next) {

// }

// 캠페인 총 갯수
async function test(req, res, next) {
  let { region, category, product } = req.query;

  // region = region.split(",");
  // category = category.split(",");
  // product = product.split(",");

  console.log(region);
  console.log(category);
  console.log(product);

  // console.log(region[0]);
  // console.log(category[0]);

  // const a = `asdfasdf;`;
  // const b = `zxcvzxvv`;
  // const c = `qweqweqr`;
  // const d = a + b + c;
  // console.log(d);

  res.json({
    success: true,
    message: "캠페인 총 갯수 조회 성공",
  });
}

// 미션 완료
async function missionComplete(req, res, next) {
  try {
    const { user_seq, campaign_seq } = req.body;

    const sql = `update campaign_application set status = 1 where user_seq = ? and campaign_seq = ?`;

    await dbpool.execute(sql, [user_seq, campaign_seq]);

    res.status(200).json({
      message: "미션 완료 성공",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "미션 완료 실패",
    });
  }
}

// 미션 완료 취소
async function missionCancel(req, res, next) {
  try {
    const { user_seq, campaign_seq } = req.body;

    const sql = `update campaign_application set status = 0 where user_seq = ? and campaign_seq = ?`;

    await dbpool.execute(sql, [user_seq, campaign_seq]);

    res.status(200).json({
      message: "미션 완료 취소 성공",
    });
  } catch (err) {
    console.log(err);

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
    console.log(err);

    res.status(500).json({
      message: "캠페인 조회수 증가 실패",
    });
  }
}

export {
  getAllCampaign,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  uploadCampaignImage,
  deleteCampaignImage,
  getCampaignImage,
  getCampaignByProgress,
  getAllCampaignBylastest,
  getAllCampaignByPopular,
  getAllCampaignBySelection,
  getCampaignByProgressBylastest,
  getCampaignByProgressByPopular,
  getCampaignByProgressBySelection,
  getCampaignByType,
  getCampaignByTypeBylastest,
  getCampaignByTypeByPopular,
  getCampaignByTypeBySelection,
  getCampaignByFiltering,
  getCampaignByFilteringBylastest,
  getCampaignByFilteringByPopular,
  getCampaignByFilteringBySelection,
  getCampaignByChannel,
  getCampaignByChannelBylastest,
  getCampaignByChannelByPopular,
  getCampaignByChannelBySelection,
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
  test,
};
