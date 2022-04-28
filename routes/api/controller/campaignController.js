import pool from "./../../../config/dbpool.js";

const dbpool = await pool;

let pagelimit = 20;
// 전체 캠페인 가져오기
async function getAllCampaign(req, res, next) {
  try {
    const sql = `SELECT * FROM campaign`;
    const results = await dbpool.query(sql);

    const campaigns = await getCampaignInfo(results[0], results[0][0].campaign_seq);

    res.status(200).json({
      message: "캠페인 전체 가져오기 성공",
      campaigns: campaigns,
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
      const sql = `SELECT * FROM campaign WHERE campaign_seq = ?`;
      const results = await dbpool.query(sql, [campaign_seq]);

      const campaign = await getCampaignInfo(results[0], campaign_seq);

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
    campaign_seq,
    advertiser,
    is_premium,
    title,
    type,
    headcount,
    siteURL,
    misson,
    reward,
    accrual_point,
    additional_infomation,
    recruit_start_date,
    recruit_end_date,
    rewviewer_announcement_date,
    agreement_portrait,
    agreement_provide_info,
    user_seq,
    channel,
    keyword,
    product,
    qna,
  } = req.body;

  if (
    campaign_seq === undefined ||
    advertiser === undefined ||
    is_premium === undefined ||
    title === undefined ||
    type === undefined ||
    headcount === undefined ||
    siteURL === undefined ||
    misson === undefined ||
    reward === undefined ||
    accrual_point === undefined ||
    additional_infomation === undefined ||
    recruit_start_date === undefined ||
    recruit_end_date === undefined ||
    rewviewer_announcement_date === undefined ||
    agreement_portrait === undefined ||
    agreement_provide_info === undefined ||
    user_seq === undefined ||
    channel === undefined ||
    keyword === undefined ||
    product === undefined ||
    qna === undefined
  ) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `insert into campaign (campaign_seq,advertiser,is_premium,title,type,headcount,siteURL,misson,reward,accrual_point,additional_infomation,recruit_start_date,recruit_end_date,rewviewer_announcement_date,agreement_portrait,agreement_provide_info,campaign_state, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const channel_sql = `insert into campaign_channel (campaign_seq, channel_code, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;
      const keyword_sql = `insert into campaign_keyword (campaign_seq, keyword, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;
      const product_sql = `insert into campaign_product (campaign_seq, product_code, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;
      const qna_sql = `insert into campaign_qna (campaign_seq, question, answer, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.beginTransaction();

      await dbpool.execute(campaign_sql, [
        campaign_seq,
        advertiser,
        is_premium,
        title,
        type,
        headcount,
        siteURL,
        misson,
        reward,
        accrual_point,
        additional_infomation,
        recruit_start_date,
        recruit_end_date,
        rewviewer_announcement_date,
        agreement_portrait,
        agreement_provide_info,
        1,
        user_seq,
        new Date(),
        user_seq,
        new Date(),
      ]);

      for (let i = 0; i < channel.length; i++) {
        await dbpool.execute(channel_sql, [
          campaign_seq,
          channel[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      for (let i = 0; i < keyword.length; i++) {
        await dbpool.execute(keyword_sql, [
          campaign_seq,
          keyword[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      for (let i = 0; i < product.length; i++) {
        await dbpool.execute(product_sql, [
          campaign_seq,
          product[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

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
    type,
    headcount,
    siteURL,
    misson,
    reward,
    accrual_point,
    additional_infomation,
    recruit_start_date,
    recruit_end_date,
    rewviewer_announcement_date,
    agreement_portrait,
    agreement_provide_info,
    user_seq,
    channel,
    keyword,
    product,
    qna,
  } = req.body;

  if (
    campaign_seq === undefined ||
    advertiser === undefined ||
    is_premium === undefined ||
    title === undefined ||
    type === undefined ||
    headcount === undefined ||
    siteURL === undefined ||
    misson === undefined ||
    reward === undefined ||
    accrual_point === undefined ||
    additional_infomation === undefined ||
    recruit_start_date === undefined ||
    recruit_end_date === undefined ||
    rewviewer_announcement_date === undefined ||
    agreement_portrait === undefined ||
    agreement_provide_info === undefined ||
    user_seq === undefined ||
    channel === undefined ||
    keyword === undefined ||
    product === undefined ||
    qna === undefined
  ) {
    res.status(400).json({
      message: "잘못된 요청입니다. 필수 데이터가 없습니다.",
    });
  } else {
    try {
      const campaign_sql = `update campaign set advertiser = ?, is_premium = ?, title = ?, type = ?, headcount = ?, siteURL = ?, misson = ?, reward = ?, accrual_point = ?, additional_infomation = ?, recruit_start_date = ?, recruit_end_date = ?, rewviewer_announcement_date = ?, agreement_portrait = ?, agreement_provide_info = ?, last_register_id = ?, last_register_date = ? where campaign_seq = ?`;
      const channel_sql = `insert into campaign_channel (campaign_seq, channel_code, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;
      const keyword_sql = `insert into campaign_keyword (campaign_seq, keyword, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;
      const product_sql = `insert into campaign_product (campaign_seq, product_code, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?)`;
      const qna_sql = `insert into campaign_qna (campaign_seq, question, answer, first_register_id, first_register_date, last_register_id, last_register_date) values (?, ?, ?, ?, ?, ?, ?)`;

      await dbpool.beginTransaction();

      await dbpool.execute(campaign_sql, [
        campaign_seq,
        advertiser,
        is_premium,
        title,
        type,
        headcount,
        siteURL,
        misson,
        reward,
        accrual_point,
        additional_infomation,
        recruit_start_date,
        recruit_end_date,
        rewviewer_announcement_date,
        agreement_portrait,
        agreement_provide_info,
        1,
        user_seq,
        new Date(),
      ]);

      await dbpool.execute(`delete from campaign_channel where campaign_seq = ?`, [campaign_seq]);
      for (let i = 0; i < channel.length; i++) {
        await dbpool.execute(channel_sql, [
          campaign_seq,
          channel[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      await dbpool.execute(`delete from campaign_keyword where campaign_seq = ?`, [campaign_seq]);
      for (let i = 0; i < keyword.length; i++) {
        await dbpool.execute(keyword_sql, [
          campaign_seq,
          keyword[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

      await dbpool.execute(`delete from campaign_product where campaign_seq = ?`, [campaign_seq]);
      for (let i = 0; i < product.length; i++) {
        await dbpool.execute(product_sql, [
          campaign_seq,
          product[i],
          user_seq,
          new Date(),
          user_seq,
          new Date(),
        ]);
      }

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

      await dbpool.execute(campaign_sql, [campaign_seq]);

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

// 전체 최신순 캠페인 + 페이징
async function getAllCampaignBylastest(req, res, next) {
  try {
    const { page } = req.query;
    const offset = (page - 1) * pagelimit;
    const campaign_sql = `select * from campaign order by recruit_start_date desc limit ? offset ?`;
    const campaign_count_sql = `select count(*) as count from campaign`;

    const campaign_results = await dbpool.execute(campaign_sql, [pagelimit, offset]);
    const campaign_count_results = await dbpool.execute(campaign_count_sql);

    const campaigns = await getCampaignInfo(
      campaign_results[0],
      campaign_results[0][0].campaign_seq
    );
    const totalCount = campaign_count_results[0][0].count;

    res.status(200).json({
      message: "캠페인 조회 성공",
      campaigs: campaigns,
      totalCount: totalCount,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "캠페인 조회 실패",
    });
  }
}

// 전체 인기순 캠페인 + 페이징
async function getAllCampaignByPopular(req, res, next) {}

// 전체 선정마감순 캠페인 + 페이징
async function getAllCampaignBySelection(req, res, next) {}

// 진행중인 캠페인 + 페이징
async function getCampaignByProgress(req, res, next) {}

// 진행중인 캠페인 최신순 + 페이징
async function getCampaignByProgressBylastest(req, res, next) {}

// 진행중인 캠페인 인기순 + 페이징
async function getCampaignByProgressByPopular(req, res, next) {}

// 진행중인 캠페인 선정마감순 + 페이징
async function getCampaignByProgressBySelection(req, res, next) {}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 + 페이징
async function getCampaignByType(req, res, next) {}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 최신순 + 페이징
async function getCampaignByTypeBylastest(req, res, next) {}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 인기순 + 페이징
async function getCampaignByTypeByPopular(req, res, next) {}

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 선정마감순 + 페이징
async function getCampaignByTypeBySelection(req, res, next) {}

// 진행중인 캠페인 필터링 + 페이징
async function getCampaignByFiltering(req, res, next) {}

// 진행중인 캠페인 필터링 최신순 + 페이징
async function getCampaignByFilteringBylastest(req, res, next) {}

// 진행중인 캠페인 필터링 인기순 + 페이징
async function getCampaignByFilteringByPopular(req, res, next) {}

// 진행중인 캠페인 필터링 선정마감순 + 페이징
async function getCampaignByFilteringBySelection(req, res, next) {}

// 진행중인 프리미엄 캠페인 + 페이징
async function getPremiumCampaign(req, res, next) {}

// 진행중인 프리미엄 캠페인 최신순 + 페이징
async function getPremiumCampaignBylastest(req, res, next) {}

// 진행중인 프리미엄 캠페인 인기순 + 페이징
async function getPremiumCampaignByPopular(req, res, next) {}

// 진행중인 프리미엄 캠페인 선정마감순 + 페이징
async function getPremiumCampaignBySelection(req, res, next) {}

// 채널별 캠페인 + 페이징
async function getCampaignByChannel(req, res, next) {}

// 채널별 최신순 캠페인 + 페이징
async function getCampaignByChannelBylastest(req, res, next) {}

// 채널별 인기순 캠페인 + 페이징
async function getCampaignByChannelByPopular(req, res, next) {}

// 채널별 선정 마감순 캠페인 + 페이징
async function getCampaignByChannelBySelection(req, res, next) {}

// 연관 캠페인 + 페이징
async function getCampaignByRelation(req, res, next) {}

// 캠페인 검색 + 페이징
async function getCampaignBySearch(req, res, next) {}

// 캠페인 검색 + 페이징 최신순
async function getCampaignBySearchBylastest(req, res, next) {}

// 캠페인 검색 + 페이징 인기순
async function getCampaignBySearchByPopular(req, res, next) {}

// 캠페인 검색 + 페이징 선정마감순
async function getCampaignBySearchBySelection(req, res, next) {}

// 캠페인 신청
async function applyCampaign(req, res, next) {}

// 캠페인 신청 취소
async function cancelCampaign(req, res, next) {}

// 특정 캠페인 신청자 목록
async function getCampaignApplicant(req, res, next) {}

// 리뷰어 선정 등록
async function createCampaignReviewer(req, res, next) {}

// 리뷰어 선정 취소
async function deleteCampaignReviewer(req, res, next) {}

// 특정 캠페인 리뷰어 선정자 목록
async function getCampaignReviewer(req, res, next) {}

// 캠페인 QnA 등록
async function createCampaignQnA(req, res, next) {}

// 캠페인 QnA 수정
async function updateCampaignQnA(req, res, next) {}

// 캠페인 QnA 삭제
async function deleteCampaignQnA(req, res, next) {}

// 캠페인 평가 등록
async function createCampaignEvaluation(req, res, next) {}

// 캠페인 평가 수정
async function updateCampaignEvaluation(req, res, next) {}

// 캠페인 평가 삭제
async function deleteCampaignEvaluation(req, res, next) {}

// 광고주 캠페인 정보 가져오기
async function getCampaignByAdvertiser(req, res, next) {}

// 광고주 캠페인 신청자 목록 가져오기
async function getCampaignApplicantByAdvertiser(req, res, next) {}

// 광고주 캠페인 리뷰어 선정자 목록 가져오기
async function getCampaignReviewerByAdvertiser(req, res, next) {}

// 광고주 캠페인 평가 목록 가져오기
async function getCampaignEvaluationByAdvertiser(req, res, next) {}

// 캠페인 channel,product,keyword,qna 반환
async function getCampaignInfo(campains, campaign_seq) {
  let data = [];

  for (let i = 0; i < campains.length; i++) {
    let campaign = campains[i];

    const channel_sql = `select cc.channel_code, ct.code_name as channel_name from campaign_channel as cc join code_table as ct on cc.channel_code = ct.code_value where cc.campaign_seq = ?`;
    const keyword_sql = `select ck.keyword, ct.code_name as keyword from campaign_keyword as ck join code_table as ct on ck.keyword = ct.code_value where ck.campaign_seq = ?`;
    const product_sql = `select cp.product_code, ct.code_name as product_name from campaign_product as cp join code_table as ct on cp.product_code = ct.code_value where cp.campaign_seq = ?`;
    const qna_sql = `select question_seq,question,answer from campaign_qna where campaign_seq = ?`;

    const channel_results = await dbpool.execute(channel_sql, [campaign_seq]);
    const keyword_results = await dbpool.execute(keyword_sql, [campaign_seq]);
    const product_results = await dbpool.execute(product_sql, [campaign_seq]);
    const qna_results = await dbpool.execute(qna_sql, [campaign_seq]);

    campaign.channel = channel_results[0];
    campaign.keyword = keyword_results[0];
    campaign.product = product_results[0];
    campaign.qna = qna_results[0];

    data.push(campaign);
  }

  return data;
}

export {
  getAllCampaign,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
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
  getCampaignEvaluationByAdvertiser,
  getPremiumCampaign,
  getPremiumCampaignBylastest,
  getPremiumCampaignByPopular,
  getPremiumCampaignBySelection,
};
