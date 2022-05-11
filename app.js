import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";

dotenv.config();

// 라우터
import indexRouter from "./routes/api/index.js";
import authRouter from "./routes/api/auth.js";
import userRouter from "./routes/api/user.js";
import faqRouter from "./routes/api/faq.js";
import noticeRouter from "./routes/api/notice.js";
import advertiseRouter from "./routes/api/advertisement.js";
import campaignRouter from "./routes/api/campaign.js";
import commonfileRouter from "./routes/api/commonfile.js";

const app = express();
const __dirname = path.resolve();

// 템플릿
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// 보안설정(Helmet)
app.use(helmet());

// APIs
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/faq", faqRouter);
app.use("/notice", noticeRouter);
app.use("/advertisement", advertiseRouter);
app.use("/campaigns", campaignRouter);
app.use("/commonfile", commonfileRouter);

// 404
app.use(function (req, res, next) {
  res.sendStatus(404);
});

// error
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render("error");
});

// http
app.listen(process.env.SERVER_PORT, () => {
  console.log("server is running...");
});

// https
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/laonlaonlaon.ml/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/laonlaonlaon.ml/fullchain.pem"),
  ca: fs.readFileSync("/etc/letsencrypt/live/laonlaonlaon.ml/chain.pem"),
};
var httpsserver = https.createServer(options, app);

httpsserver.listen(process.env.HTTPS_SERVER_PORT, () => {
  console.log("https server is running...");
});
