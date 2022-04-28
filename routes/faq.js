import express from "express";
import { authJWT } from "../middleware/jwt/authJWT.js";
import * as faqController from "./controller/faqController.js";

const router = express.Router();

// faq 가져오기
router.get("/", authJWT, faqController.getFaq);

// faq 등록
router.post("/", authJWT, faqController.createFaq);

// faq 수정
router.patch("/", authJWT, faqController.updateFaq);

// faq 삭제
router.delete("/", authJWT, faqController.deleteFaq);

export default router;
