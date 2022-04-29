import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import { campaignUpload } from "./../../middleware/multer.js";
import * as campaignController from "./controller/campaignController.js";

const router = express.Router();

// 전체 캠페인 가져오기 (get)
router.get("/all", campaignController.getAllCampaign);

// 특정 캠페인 가져오기 (get)
router.get("/", campaignController.getCampaign);

// 캠페인 등록 (post)
router.post("/", campaignController.createCampaign);

// 캠페인 수정 (patch)
router.patch("/", authJWT, campaignController.updateCampaign);

// 캠페인 삭제 (delete)
router.delete("/", authJWT, campaignController.deleteCampaign);

// 캠페인 사진 업로드 (post)
router.post(
  "/image",
  campaignUpload.array("campaign_img", 10),
  campaignController.uploadCampaignImage
);

// 캠페인 사진 가져오기 (get)
router.get("/image", authJWT, campaignController.getCampaignImage);

// 캠페인 사진 삭제 (delete)
router.delete("/image", authJWT, campaignController.deleteCampaignImage);

// 전체 최신순 캠페인 + 페이징 (get)
router.get("/all/lastest", campaignController.getAllCampaignBylastest);

// 전체 인기순 캠페인 + 페이징 (get)
router.get("/all/popular", campaignController.getAllCampaignByPopular);

// 전체 선정마감순 캠페인 + 페이징 (get)
router.get("/all/selection", campaignController.getAllCampaignBySelection);

// 진행중인 캠페인 + 페이징 (get)
router.get("/progress", campaignController.getCampaignByProgress);

// 진행중인 캠페인 최신순 + 페이징 (get)
router.get("/progress/lastest", campaignController.getCampaignByProgressBylastest);

// 진행중인 캠페인 인기순 + 페이징 (get)
router.get("/progress/popular", campaignController.getCampaignByProgressByPopular);

// 진행중인 캠페인 선정마감순 + 페이징 (get)
router.get("/progress/selection", campaignController.getCampaignByProgressBySelection);

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 + 페이징 (get)
router.get("/progress/type", campaignController.getCampaignByType);

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 최신순 + 페이징 (get)
router.get("/progress/type/lastest", campaignController.getCampaignByTypeBylastest);

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 인기순 + 페이징 (get)
router.get("/progress/type/popular", campaignController.getCampaignByTypeByPopular);

// 진행중인 타입별(방문형,배송형,기자단) 캠페인 선정마감순 + 페이징 (get)
router.get("/progress/type/selection", campaignController.getCampaignByTypeBySelection);

// 진행중인 캠페인 필터링 + 페이징 (get)
router.get("/progress/filter", campaignController.getCampaignByFiltering);

// 진행중인 캠페인 필터링 최신순 + 페이징 (get)
router.get("/progress/filter/lastest", campaignController.getCampaignByFilteringBylastest);

// 진행중인 캠페인 필터링 인기순 + 페이징 (get)
router.get("/progress/filter/popular", campaignController.getCampaignByFilteringByPopular);

// 진행중인 캠페인 필터링 선정마감순 + 페이징 (get)
router.get("/progress/filter/selection", campaignController.getCampaignByFilteringBySelection);

// 진행중인 프리미엄 캠페인 + 페이징 (get)
router.get("/progress/premium", campaignController.getPremiumCampaign);

// 진행중인 프리미엄 캠페인 최신순 + 페이징 (get)
router.get("/progress/premium/lastest", campaignController.getPremiumCampaignBylastest);

// 진행중인 프리미엄 캠페인 인기순 + 페이징 (get)
router.get("/progress/premium/popular", campaignController.getPremiumCampaignByPopular);

// 진행중인 프리미엄 캠페인 선정마감순 + 페이징 (get)
router.get("/progress/premium/selection", campaignController.getPremiumCampaignBySelection);

// 채널별 캠페인 + 페이징 (get)
router.get("/channel", campaignController.getCampaignByChannel);

// 채널별 최신순 캠페인 + 페이징 (get)
router.get("/channel/lastest", campaignController.getCampaignByChannelBylastest);

// 채널별 인기순 캠페인 + 페이징 (get)
router.get("/channel/popular", campaignController.getCampaignByChannelByPopular);

// 채널별 선정 마감순 캠페인 + 페이징 (get)
router.get("/channel/selection", campaignController.getCampaignByChannelBySelection);

// 연관 캠페인 + 페이징 (get)
// router.get("/relation", campaignController.getCampaignByRelation);

// 캠페인 검색 + 페이징 (get)
router.get("/search", campaignController.getCampaignBySearch);

// 캠페인 검색 + 페이징 최신순 (get)
router.get("/search/lastest", campaignController.getCampaignBySearchBylastest);

// 캠페인 검색 + 페이징 인기순 (get)
router.get("/search/popular", campaignController.getCampaignBySearchByPopular);

// 캠페인 검색 + 페이징 선정마감순 (get)
router.get("/search/selection", campaignController.getCampaignBySearchBySelection);

// 캠페인 신청 (post)
router.post("/apply", authJWT, campaignController.applyCampaign);

// 캠페인 신청 취소 (delete)
router.delete("/apply", authJWT, campaignController.cancelCampaign);

// 특정 캠페인 신청자 목록 + 페이징 (get)
router.get("/campaign/applicant", authJWT, campaignController.getCampaignApplicant);

// 리뷰어 선정 등록 (post)
router.post("/campaign/reviewer", authJWT, campaignController.createCampaignReviewer);

// 리뷰어 선정 취소 (delete)
router.delete("/campaign/reviewer", authJWT, campaignController.deleteCampaignReviewer);

// 특정 캠페인 리뷰어 선정자 목록 + 페이징 (get)
router.get("/campaign/reviewer/list", authJWT, campaignController.getCampaignReviewer);

// 캠페인 QnA 등록 (post)
router.post("/campaign/qna", authJWT, campaignController.createCampaignQnA);

// 캠페인 QnA 수정 (patch)
router.patch("/campaign/qna", authJWT, campaignController.updateCampaignQnA);

// 캠페인 QnA 삭제 (delete)
router.delete("/campaign/qna", authJWT, campaignController.deleteCampaignQnA);

// 캠페인 평가 등록 (post)
router.post("/campaign/evaluation", authJWT, campaignController.createCampaignEvaluation);

// 캠페인 평가 수정 (patch)
router.patch("/campaign/evaluation", authJWT, campaignController.updateCampaignEvaluation);

// 캠페인 평가 삭제 (delete)
router.delete("/campaign/evaluation", authJWT, campaignController.deleteCampaignEvaluation);

// 광고주 캠페인 정보 가져오기 (get)
router.get("/advertiser/campaign/info", authJWT, campaignController.getCampaignByAdvertiser);

// 광고주 캠페인 신청자 목록 가져오기 (get)
router.get(
  "/advertiser/campaign/applicant",
  authJWT,
  campaignController.getCampaignApplicantByAdvertiser
);

// 광고주 캠페인 리뷰어 선정자 목록 가져오기 (get)
router.get(
  "/advertiser/campaign/reviewer",
  authJWT,
  campaignController.getCampaignReviewerByAdvertiser
);

// 광고주 캠페인 평가 목록 가져오기 (get)
// router.get(
//   "/advertiser/campaign/evaluation",
//   authJWT,
//   campaignController.getCampaignEvaluationByAdvertiser
// );

router.get("/test/test", campaignController.test);

export default router;
