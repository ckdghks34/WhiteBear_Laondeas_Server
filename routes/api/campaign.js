import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import { campaignUpload } from "./../../middleware/multer.js";
import * as campaignController from "./controller/campaignController.js";

const router = express.Router();

const campaign_upload = campaignUpload.fields([
  { name: "campaign_img_detail", maxCount: 5 },
  { name: "campaign_img_thumbnail", maxCount: 5 },
]);

// 전체 캠페인 가져오기 (get)
router.get("/all", campaignController.getAllCampaign);

// 특정 캠페인 가져오기 (get)
router.get("/", campaignController.getCampaign);

// 캠페인 등록 (post)
router.post("/", authJWT, campaignController.createCampaign);

// 캠페인 수정 (patch)
router.patch("/", authJWT, campaignController.updateCampaign);

// 캠페인 삭제 (delete)
router.delete("/", authJWT, campaignController.deleteCampaign);

// 캠페인 사진 업로드 (post)
router.post("/image", authJWT, campaign_upload, campaignController.uploadCampaignImage);

// 캠페인 사진 가져오기 (get)
router.get("/image", campaignController.getCampaignImage);

// 캠페인 사진 삭제 (delete)
router.delete("/image", authJWT, campaignController.deleteCampaignImage);

// 캠페인 썸네일 이미지 수정 (patch)
router.patch(
  "/image/thumbnail",
  authJWT,
  campaign_upload,
  campaignController.updateCampaignThumbnail
);

// 캠페인 상세페이지 이미지 수정
router.patch("/image/detail", authJWT, campaign_upload, campaignController.updateCampaignDetail);

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

// 진행중인 캠페인(캠페인 마감일자가 지나지 않은 캠페인 중 모집마감이 되지 않은 캠페인 우선)
router.get("/progress/campaign", campaignController.getCampaignByCampaign);

// 진행중인 캠페인 필터링 (챗봇용)
router.post("/chatbot/filter", campaignController.getCampaignByFilteringWithChatbot);

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
router.get("/relation", campaignController.getCampaignByRelation);

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

// 미션 완료
router.patch("/mission/complete", authJWT, campaignController.missionComplete);

// 미션 취소
router.patch("/mission/cancel", authJWT, campaignController.missionCancel);

// 조회수 증가
router.patch("/campaign/view-count", campaignController.increaseCampaignViewCount);

// 리뷰 등록 (post)
router.post("/review", authJWT, campaignController.createReview);

// 리뷰 수정 (patch)
router.patch("/review", authJWT, campaignController.updateReview);

// 리뷰 삭제 (delete)
router.delete("/review", authJWT, campaignController.deleteReview);

// 등록된 모든 리뷰 가져오기 (get)
router.get("/reviews", authJWT, campaignController.getAllReview);

// 등록된 모든 리뷰 캠페인별 가져오기  (get)
router.get("/reviews/group", authJWT, campaignController.getAllReviewGroupByCampaign);

// 등록된 모든 리뷰 캠페인별 가져오기 카테고리별(배송형,방문형,기자단,프리미엄) (get)
router.get(
  "/reviews/group/type",
  authJWT,
  campaignController.getAllReviewGroupByCampaignByCategory
);

// 상세 리뷰 가져오기 (get)
router.get("/review/detail", authJWT, campaignController.getReviewDetail);

// 유저별 등록 리뷰 가져오기 (get)
router.get("/review/user", authJWT, campaignController.getReviewByUser);

// 캠페인별 등록 리뷰 가져오기 (get)
router.get("/review/campaign", authJWT, campaignController.getReviewByCampaign);

// 조회수 기준 캠페인 가져오기
router.get("/all/viewcount", authJWT, campaignController.getCampaignByViewCount);

// 조회수 기준 진행중인 캠페인 가져오기
router.get("/all/progress/viewcount", authJWT, campaignController.getCampaignByProgressByViewCount);

// router.get("/test/test", campaignController.test);

export default router;
