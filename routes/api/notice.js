import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import * as noticeController from "./controller/noticeController.js";

const router = express.Router();

// 공지사항 가져오기
router.get("/", noticeController.getNotice);

// 공지사항 등록
router.post("/", /* authJWT, */ noticeController.createNotice);

// 공지사항 수정
router.patch("/", /* authJWT, */ noticeController.updateNotice);

// 공지사항 삭제
router.delete("/", /* authJWT, */ noticeController.deleteNotice);

// 공지사항 조회수 증가
router.patch("/view-count", /* authJWT, */ noticeController.increaseViewCount);

// 공지사항 상세 조회
router.get("/detail", /* authJWT, */ noticeController.getNoticeDetail);

export default router;
