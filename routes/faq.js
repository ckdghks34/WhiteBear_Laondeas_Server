import express from "express";
import * as faqController from "./controller/faqController.js";

const router = express.Router();

// faq 가져오기
router.get("/", faqController.getFaq);

// faq 등록
router.post("/", faqController.createFaq);

// faq 수정
router.patch("/", faqController.updateFaq);

// faq 삭제
router.delete("/", faqController.deleteFaq);

export default router;
