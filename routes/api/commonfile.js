import express from "express";
import { authJWT } from "./../../middleware/jwt/authJWT.js";
import { bannerUpload, widgetUpload, popupUpload } from "./../../middleware/multer.js";
import * as commonfileController from "./controller/commonfileController.js";

const router = express.Router();

const widget_upload = widgetUpload.fields([
  { name: "premier_widget_img", maxCount: 1 },
  { name: "widget_img", maxCount: 1 },
]);

// 배너 등록 (post)
router.post(
  "/banner",
  authJWT,
  bannerUpload.single("banner_img"),
  commonfileController.createBanner
);

// 배너 활성화
router.patch("/banner", authJWT, commonfileController.activateBanner);

// 배너 비활성화
router.patch("/banner/deactivate", authJWT, commonfileController.deactivateBanner);

// 배너 가져오기
router.get("/banner", commonfileController.getBanner);

// 위젯 등록
router.post("/widget", authJWT, widget_upload, commonfileController.createWidget);

// 위젯 삭제
router.delete("/widget", authJWT, commonfileController.deleteWidget);

// 위젯 가져오기
router.get("/widget", commonfileController.getWidget);

// 팝업 등록
router.post("/popup", authJWT, popupUpload.single("popup_img"), commonfileController.createPopup);

// 팝업 삭제
router.delete("/popup", authJWT, commonfileController.deletePopup);

// 팝업 활성화
router.patch("/popup", authJWT, commonfileController.activatePopup);

// 팝업 비활성화
router.patch("/popup/deactivate", authJWT, commonfileController.deactivatePopup);

// 특정 팝업 가져오기
router.get("/popup", commonfileController.getAllPopup);

// 활성화 팝업 가져오기
router.get("/popup/active", commonfileController.getActivatePopup);

// 전체 팝업 가져오기
router.get("/popup/all", commonfileController.getAllPopup);

export default router;
