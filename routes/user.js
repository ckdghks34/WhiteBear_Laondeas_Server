import express from "express";
import * as userController from "./controller/userController.js";

const router = express.Router();

// 특정 아이디 조회하기
router.get("/", userController.getUser);

// 회원 정보 수정
router.patch("/", userController.updateUser);

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

/**
 * 유저 페널티
 */

// 페널티 조회
router.get("/penalty", userController.getPenaltyList);

// 페널티 등록
router.post("/penalty", userController.createPenalty);

// 페널티 수정
router.patch("/penalty", userController.updatePenalty);

// 페널티 삭제
router.delete("/penalty", userController.deletePenalty);
export default router;
