import express from "express";
import * as userController from "./controller/userController.js";

const router = express.Router();

// 특정 아이디 조회하기
router.get("/", userController.getUser);
export default router;
