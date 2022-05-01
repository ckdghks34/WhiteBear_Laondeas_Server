import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import { profileUpload } from "./../../middleware/multer.js";
import * as userController from "./controller/userController.js";

const router = express.Router();

/**
 * 회원 기능
 */
// 전체 회원 조회
router.get("/all", userController.getAllUser);

// 특정 회원 조회하기
router.get("/", userController.getUser);

// 기본회원정보 수정 (이름, 성별, 생년월일, 닉네임, 이메일,전화번호)
router.patch("/", userController.updateUser);

// 부가 정보 수정(관심사, 지역, 채널)
router.patch("/additional", userController.updateAdditionalInfo);

// 부가 정보 가져오기(관심사, 지역, 채널)
router.get("/additional", userController.getAdditionalInfo);

// SNS 정보 수정
router.patch("/sns", userController.updateSNSInfo);

// 비밀번호 수정
router.patch("/password", userController.updatePassword);

// 프로필 사진 등록
router.post("/profile", profileUpload.single("profile_img"), userController.createProfile);

// 프로필 사진 가져오기
router.get("/profile", userController.getProfile);

// 프로필 사진 바꾸기
// router.patch("/profile", userController.updateProfile);

// 관심 캠페인 가져오기
router.get("/interest-campaign", userController.getInterestCampaign);

// 관심 캠페인 등록
router.post("/interest-campaign", userController.createInterestCampaign);

// 관심 캠페인 해제
router.delete("/interest-campaign", userController.deleteInterestCampaign);

// 나의 캠페인 가져오기
router.get("/my-campaign", userController.getMyCampaign);

// 종료된 캠페인 가져오기
router.get("/end-campaign", userController.getEndCampaign);

/**
 * 프리미엄 기능
 */

// 프리미엄 신청
router.post("/premium/application", userController.createPremiumRequest);

// 프리미엄 신청 목록
router.get("/premium/application", userController.getPremiumRequestList);

// 프리미엄 회원 목록 가져오기
router.get("/premium/user", userController.getPremiumUserList);

// 프리미엄 회원 등록
router.post("/premium/user", userController.createPremium);

// 프리미엄 회원 해제
router.patch("/premium/user", userController.deletePremium);

// 프리미엄 신청 상세
router.get("/premium/application/detail", userController.getPremiumRequestDetail);

/**
 * 출석 체크
 */

// 출석체크 등록
router.post("/attendance", userController.attendanceCheck);

// 출석체크 리스트 가져오기
router.get("/attendance", userController.getAttendanceList);

/**
 * 포인트 & 출금
 */

// 포인트 적립

router.post("/point/accrual", userController.accrual);

// 유저별 포인트 적립내역 가져오기
router.get("/point/accrual/user", userController.getUserAccrualList);

// 전체 유저 적립 내역 가져오기
router.get("/point/accrual", userController.getAllUserAccrualList);

// 출금 신청
router.post("/point/withdrawal", userController.withdrawalRequest);

// 유저별 출금 신청 내역 가져오기
router.get("/point/withdrawal/user", userController.getWithdrawalRequestList);

// 전체 유저 출금 신청 내역 가져오기
router.get("/point/withdrawal", userController.getAllUserWithdrawalRequestList);

// 출금 등록
router.post("/withdrawal", userController.withdrawal);

// 유저별 출금 내역 가져오기
router.get("/withdrawal/users", userController.getUserWithdrawalList);

// 전체 유저 출금 내역 가져오기
router.get("/withdrawal", userController.getAllUserWithdrawalList);

/**
 * 메세지
 */

// 메세지 보내기
router.post("/message", userController.sendMessage);

// 메세지 확인
router.patch("/message", userController.readMessage);

// 유저 메세지 목록 보기
router.get("/message", userController.getUserMessageList);

// 전체 메세지 목록 보기
router.get("/message/all", userController.getAllMessageList);

// 유저 읽지않은 메세지 갯수
router.get("/message/unread", userController.getUnreadMessageCount);

/**
 * 유저 주소록
 */

// 주소록 가져오기
router.get("/address", userController.getAddressBook);

// 주소록 등록
router.post("/address", userController.createAddressBook);

// 주소록 삭제
router.delete("/address", userController.deleteAddressBook);

// 주소록 수정
router.patch("/address", userController.updateAddressBook);

// 기본 배송지 변경
router.patch("/address/default", userController.updateDefaultAddressBook);

// 유저별 주소록 가져오기
router.get("/address/user", userController.getUserAddressBook);

/**
 * 유저 페널티
 */

// 전체 페널티 조회
router.get("/penalty/all", userController.getAllPenaltyList);

// 유저 페널티 조회
router.get("/penalty", userController.getPenaltyList);

// 진행 중인 페널티 목록
router.get("/penalty-proceeding", userController.getPenaltyProceedingList);

// 페널티 등록
router.post("/penalty", userController.createPenalty);

// 페널티 수정
router.patch("/penalty", userController.updatePenalty);

// 페널티 삭제
router.delete("/penalty", userController.deletePenalty);

/**
 * QnA : 문의 답변
 */

// 문의 등록
router.post("/qna", userController.createQuestion);

// 답변 등록
router.post("/qna/answer", userController.createAnswer);

// 문의 수정
router.patch("/qna", userController.updateQuestion);

// 답변 수정
router.patch("/qna/answer", userController.updateAnswer);

// 전체 문의 답변 리스트 가져오기
router.get("/qna/list", userController.getQNAList);

// 특정 문의 답변 가져오기
router.get("/qna", userController.getQNA);

// 유저별 문의 답변 목록 가져오기
router.get("/qna/user", userController.getUserQNA);

export default router;
