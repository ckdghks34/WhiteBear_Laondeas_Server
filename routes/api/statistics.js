import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import * as statisticsController from "./controller/statisticsController.js";

const router = express.Router();

// 통게
router.get("/", authJWT, statisticsController.getStatistics);

// download Statistics
router.get("/download", authJWT, statisticsController.downloadStatistics);

// Test xlsx
router.get("/test", statisticsController.getTest);

export default router;
