import express from "express";
import { bannerUpload, widgetUpload } from "./../../middleware/multer.js";
import * as commonfileController from "./controller/commonfileController.js";

const router = express.Router();

const widget_upload = widgetUpload.fields([
  { name: "premier_widget_img", maxCount: 1 },
  { name: "widget_img", maxCount: 1 },
]);

// 배너 등록 (post)
router.post("/banner", bannerUpload.array("banner_img", 5), commonfileController.createBanner);

// 배너 활성화
router.patch("/banner", commonfileController.activateBanner);

// 배너 비활성화
router.patch("/banner/deactivate", commonfileController.deactivateBanner);

// 배너 가져오기
router.get("/banner", commonfileController.getBanner);

// 위젯 등록
router.post("/widget", widget_upload, commonfileController.createWidget);

// 위젯 삭제
router.delete("/widget", commonfileController.deleteWidget);

// 위젯 가져오기
router.get("/widget", commonfileController.getWidget);

export default router;
