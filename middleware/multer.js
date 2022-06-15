import { s3, Bucket } from "./../util/s3.js";
import multer from "multer";
import multerS3 from "multer-s3";

const profileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }

      cb(null, "profileimage/" + Date.now() + file.originalname.split(".")[0] + "." + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량제한 5MB
});

const campaignUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }

      if (file.fieldname === "campaign_img_detail") {
        cb(
          null,
          "campaignimage/" + "detail_" + Date.now() + file.originalname.split(".")[0] + "." + ext
        );
      } else {
        cb(
          null,
          "campaignimage/" + "thumbnail_" + Date.now() + file.originalname.split(".")[0] + "." + ext
        );
      }
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 용량제한 5MB
});

const bannerUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }

      cb(
        null,
        "commonfile/" + "banner_" + Date.now() + file.originalname.split(".")[0] + "." + ext
      );
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 용량제한 5MB
});

const widgetUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }

      if (file.fieldname === "premier_widget_img") {
        cb(
          null,
          "commonfile/" +
            "premier_widget_" +
            Date.now() +
            file.originalname.split(".")[0] +
            "." +
            ext
        );
      } else {
        cb(
          null,
          "commonfile/" + "widget_" + Date.now() + file.originalname.split(".")[0] + "." + ext
        );
      }
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 용량제한 5MB
});

const popupUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }

      cb(null, "popupImage/" + "popup_" + Date.now() + file.originalname.split(".")[0] + "." + ext);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 용량제한 5MB
});

export { profileUpload, campaignUpload, bannerUpload, widgetUpload, popupUpload };
