import express from "express";
import * as authController from "./controller/authController.js";

const router = express.Router();

// 회원가입
router.post("/new", authController.signup);

// 로그인
router.post("/login", authController.login);

// 회원탈퇴
router.delete("/", authController.deleteUser);

// 동일 아이디 여부
router.get("/checkID", authController.checkID);

export default router;
