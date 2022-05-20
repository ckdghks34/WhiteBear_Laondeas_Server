import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import * as advertiseController from "./controller/advertisementController.js";

const router = express.Router();

// 광고 신청 등록
router.post("/", advertiseController.createAdvertise);

// 광고 신청 목록 가져오기
router.get("/", advertiseController.getAdvertiseList);

// 광고 신청 승인
router.patch("/approve", advertiseController.approveAdvertise);

// 광고 신청 반려
router.patch("/reject", advertiseController.rejectAdvertise);

export default router;
