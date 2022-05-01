import express from "express";
import * as refresh from "./../../middleware/jwt/refresh.js";
import * as authController from "./controller/authController.js";

const router = express.Router();

// 회원가입
router.post("/new", authController.signup);

// 로그인
router.post("/login", authController.login);

// 회원탈퇴
router.delete("/", authController.deleteUser);

// 아이디찾기
// router.get("/find/id", authController.findID);

// 비밀번호찾기
// router.get("/find/pw", authController.findPW);

// 로그아웃
router.get("/logout", authController.logout);

// 동일 아이디 여부
router.get("/checkID", authController.checkID);

// access token 재발급
router.get("/refresh", refresh.refresh);

// 코드 목록 가져오기
router.get("/code", authController.getCodetable);

// 코드 등록 하기
router.post("/code", authController.addCode);

// token 로그인
router.post("/login/token", authController.tokenLogin);

export default router;
