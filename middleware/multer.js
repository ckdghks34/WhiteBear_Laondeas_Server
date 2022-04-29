import { s3, bucket } from "./../util/s3.js";
import multer from "multer";
import multerS3 from "multer-s3";

const profileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
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
    bucket: bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }

      cb(null, "campaignimage/" + Date.now() + file.originalname.split(".")[0] + "." + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량제한 5MB
});

export { profileUpload, campaignUpload };
