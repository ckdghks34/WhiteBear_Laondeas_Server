import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import * as statisticsController from "./controller/statisticsController.js";

const router = express.Router();

// 통게
router.get("/", /*authJWT,*/ statisticsController.getStatistics);

export default router;
