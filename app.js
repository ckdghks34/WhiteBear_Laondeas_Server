import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();

// 라우터
import indexRouter from "./routes/index.js";

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

// APIs
app.use("/", indexRouter);

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
