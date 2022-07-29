import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import { profileUpload } from "./../../middleware/multer.js";
import * as userController from "./controller/userController.js";

const router = express.Router();

/**
 * 회원 기능
 */
// 전체 회원 조회
router.get("/all", authJWT, userController.getAllUser);

// 전체 회원 조회 가입 입자별 (필터링)
router.get("/all/filter/joindate", authJWT, userController.getAllUserByJoinDate);

// 전체 회원 조회 포인트별 (필터링)
router.get("/all/filter/point", authJWT, userController.getAllUserByPoint);

// 전체 회원 조회 누적포인트별 (필터링)
router.get("/all/filter/accumulatepoint", authJWT, userController.getAllUserByAccumulatePoint);

// 전체 회원 조회 유형별(일반, 프리미엄) (필터링)
router.get("/all/filter/type", authJWT, userController.getAllUserByType);

// 전체 회원 조회 성별(남, 여) (필터링)
router.get("/all/filter/gender", authJWT, userController.getAllUserByGender);

// 특정 회원 조회하기
router.get("/", authJWT, userController.getUser);

// 기본회원정보 수정 (이름, 성별, 생년월일, 닉네임, 이메일,전화번호)
router.patch("/", authJWT, userController.updateUser);

// 부가 정보 수정(관심사, 지역, 채널)
router.patch("/additional", authJWT, userController.updateAdditionalInfo);

// 부가 정보 가져오기(관심사, 지역, 채널)
router.get("/additional", authJWT, userController.getAdditionalInfo);

// 유저 추가 정보 수정(사이즈 정보, 피부정보, 라이프정보)
router.patch("/info/additional", authJWT, userController.updateUserAdditionalInfo);

// SNS 정보 수정
router.patch("/sns", authJWT, userController.updateSNSInfo);

// 비밀번호 수정
router.patch("/password", authJWT, userController.updatePassword);

// 사용자 등급 조정
router.patch("/grade", authJWT, userController.updateUserGrade);

// 프로필 사진 등록
router.post("/profile", authJWT, profileUpload.single("profile_img"), userController.createProfile);

// 프로필 사진 가져오기
router.get("/profile", authJWT, userController.getProfile);

// 프로필 사진 바꾸기
router.delete("/profile", authJWT, userController.deleteProfile);

// 관심 캠페인 가져오기
router.get("/interest-campaign", authJWT, userController.getInterestCampaign);

// 관심 캠페인 등록
router.post("/interest-campaign", authJWT, userController.createInterestCampaign);

// 관심 캠페인 해제
router.delete("/interest-campaign", authJWT, userController.deleteInterestCampaign);

// 나의 캠페인 가져오기
router.get("/my-campaign", authJWT, userController.getMyCampaign);

// 종료된 캠페인 가져오기
router.get("/end-campaign", authJWT, userController.getEndCampaign);

/**
 * 리뷰어 관련 목록
 */

// Reviewer 선정 된 캠페인 목록
router.get("/my-campaign/reviewer", authJWT, userController.getReviewCampaigns);

// Reviewer 선정된 캠페인 중 리뷰 등록 완료한 목록
router.get("/my-campaign/reviewer/complete", authJWT, userController.getReviewCamapaignsByComplete);

// Reviewer 선정된 캠페인 중 리뷰 등록이 필요한 목록
router.get(
  "/my-campaign/reviewer/incomplete",
  authJWT,
  userController.getReviewCamapaignsByImcomplete
);

/**
 * 프리미엄 기능
 */

// 프리미엄 신청
router.post("/premium/application", authJWT, userController.createPremiumRequest);

// 프리미엄 신청 목록
router.get("/premium/application", authJWT, userController.getPremiumRequestList);

// 프리미엄 신청 목록 포인트별 내림차순
router.get(
  "/premium/application/filter/point",
  authJWT,
  userController.getPremiumRequestListByPoint
);

// 프리미엄 신청 목록 처리 승인 목록
router.get(
  "/premium/application/filter/complete",
  authJWT,
  userController.getPremiumRequestListByComplete
);

// 프리미엄 신청 목록 처리 대기 목록
router.get(
  "/premium/application/filter/pending",
  authJWT,
  userController.getPremiumRequestListByPending
);

// 프리미엄 회원 신청 승인 (patch)
router.patch("/premium/application/approve", authJWT, userController.approvePremium);

// 프리미엄 회원 신청 승인 거절 (patch)
router.patch("/premium/application/reject", authJWT, userController.rejectPremium);

// 프리미엄 회원 목록 가져오기
router.get("/premium/user", authJWT, userController.getPremiumUserList);

// 프리미엄 회원 등록
router.post("/premium/user", authJWT, userController.createPremium);

// 프리미엄 회원 해제
router.patch("/premium/user", authJWT, userController.deletePremium);

// 프리미엄 신청 상세
router.get("/premium/application/detail", authJWT, userController.getPremiumRequestDetail);

/**
 * 출석 체크
 */

// 출석체크 등록
router.post("/attendance", authJWT, userController.attendanceCheck);

// 출석체크 리스트 가져오기
router.get("/attendance", authJWT, userController.getAttendanceList);

// 전체 출석체크 리스트 가져오기
router.get("/attendance/all", authJWT, userController.getAllAttendanceList);

/**
 * 포인트 & 출금
 */

// 포인트 적립

router.post("/point/accrual", authJWT, userController.accrual);

// 유저별 포인트 적립내역 가져오기
router.get("/point/accrual/user", authJWT, userController.getUserAccrualList);

// 전체 유저 적립 내역 가져오기
router.get("/point/accrual", authJWT, userController.getAllUserAccrualList);

// 출금 신청
router.post("/point/withdrawal", authJWT, userController.withdrawalRequest);

// 유저별 출금 신청 내역 가져오기
router.get("/point/withdrawal/user", authJWT, userController.getWithdrawalRequestList);

// 전체 유저 출금 신청 내역 가져오기
router.get("/point/withdrawal", authJWT, userController.getAllUserWithdrawalRequestList);

// 출금 승인
router.patch("/withdrawal", authJWT, userController.withdrawal);

// 출금 승인 거절
router.patch("/withdrawal/reject", authJWT, userController.withdrawal_reject);

// 유저별 출금 내역 가져오기
router.get("/withdrawal/users", authJWT, userController.getUserWithdrawalList);

// 전체 유저 출금 내역 가져오기
router.get("/withdrawal", authJWT, userController.getAllUserWithdrawalList);

/**
 * 메세지
 */

// 메세지 보내기
router.post("/message", authJWT, userController.sendMessage);

// 메세지 확인
router.patch("/message", authJWT, userController.readMessage);

// 유저 메세지 목록 보기
router.get("/message", authJWT, userController.getUserMessageList);

// 전체 메세지 목록 보기
router.get("/message/all", authJWT, userController.getAllMessageList);

// 유저 읽지않은 메세지 갯수
router.get("/message/unread", authJWT, userController.getUnreadMessageCount);

// 유저별 메세지 전체 읽음 처리
router.patch("/message/all", authJWT, userController.readAllMessage);

/**
 * 유저 주소록
 */

// 주소록 가져오기
router.get("/address", authJWT, userController.getAddressBook);

// 주소록 등록
router.post("/address", authJWT, userController.createAddressBook);

// 주소록 삭제
router.delete("/address", authJWT, userController.deleteAddressBook);

// 주소록 수정
router.patch("/address", authJWT, userController.updateAddressBook);

// 기본 배송지 변경
router.patch("/address/default", authJWT, userController.updateDefaultAddressBook);

// 유저별 주소록 가져오기
router.get("/address/user", authJWT, userController.getUserAddressBook);

/**
 * 유저 페널티
 */

// 전체 페널티 조회
router.get("/penalty/all", authJWT, userController.getAllPenaltyList);

// 유저 페널티 조회
router.get("/penalty", authJWT, userController.getPenaltyList);

// 진행 중인 페널티 목록
router.get("/penalty-proceeding", authJWT, userController.getPenaltyProceedingList);

// 페널티 등록
router.post("/penalty", authJWT, userController.createPenalty);

// 페널티 수정
router.patch("/penalty", authJWT, userController.updatePenalty);

// 페널티 삭제
router.delete("/penalty", authJWT, userController.deletePenalty);

/**
 * QnA : 문의 답변
 */

// 문의 등록
router.post("/qna", authJWT, userController.createQuestion);

// 답변 등록
router.post("/qna/answer", authJWT, userController.createAnswer);

// 문의 수정
router.patch("/qna", authJWT, userController.updateQuestion);

// 답변 수정
router.patch("/qna/answer", authJWT, userController.updateAnswer);

// 전체 문의 답변 리스트 가져오기
router.get("/qna/list", authJWT, userController.getQNAList);

// 특정 문의 답변 가져오기
router.get("/qna", authJWT, userController.getQNA);

// 유저별 문의 답변 목록 가져오기
router.get("/qna/user", authJWT, userController.getUserQNA);

/**
 * 블랙리스트
 */

// 전체 블랙리스트 가져오기 (get)
router.get("/blacklist", authJWT, userController.getBlackList);

// 활성화된 블랙리스트 가져오기 (get)
router.get("/blacklist/active", authJWT, userController.getBlackListActive);

// 사용자 별 블랙리스트 가져오기 (get)
router.get("/blacklist/user", authJWT, userController.getBlackListByUser);

// 블랙리스트 등록 (post)
router.post("/blacklist", authJWT, userController.createBlackList);

//블랙리스트 삭제 (delete)
router.delete("/blacklist", authJWT, userController.deleteBlackList);

// 블랙리스트 수정 (patch)
router.patch("/blacklist", authJWT, userController.updateBlackList);

// 블랙리스트 활성화 (patch)
router.patch("/blacklist/active", authJWT, userController.activeBlackList);

// 블랙리스트 비활성화 (patch)
router.patch("/blacklist/inactive", authJWT, userController.inactiveBlackList);

export default router;
