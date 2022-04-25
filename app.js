import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();

// 라우터
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import faqRouter from "./routes/faq.js";
import noticeRouter from "./routes/notice.js";
import advertiseRouter from "./routes/advertise.js";

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

// 보안설정(Helmet)
app.use(helmet());

// APIs
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/faq", faqRouter);
app.use("/notice", noticeRouter);
app.use("/advertisement", advertiseRouter);

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

app.listen(process.env.SERVER_PORT, () => {
  console.log("server is running...");
});
