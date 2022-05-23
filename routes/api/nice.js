import express from "express";
import * as niceController from "./controller/niceController.js";
import pgInfo from "./../../config/pginfo.js";
const router = express.Router();

// 암호화 데이터(키) 발급
router.get("/encrypt/data", niceController.createSecretKey);

// callback & redirect
router.all("decrypt/data", niceController.decryptData);

export default router;
