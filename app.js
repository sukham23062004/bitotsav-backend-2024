const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const xss = require("xss-clean");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const AppError = require("./utils/appError");
const userRouter = require("./route/userRoute");
const teamRouter = require("./route/teamRoute");
const eventRouter = require("./route/eventRoute");
const clubRouter = require("./route/clubRoute.js");
const categoriesRouter = require("./route/categoryRoute.js");
const leaderBoardRouter = require("./route/leaderBoardRoute");
const globalErrorHandler = require("./controller/errorController");

dotenv.config();
// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(",");

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.set("trust proxy", 1);
// app.use(limiter);
const corsOptions = {
  origin: "https://bitotsav2024-jade.vercel.app",
};
app.use(cors(corsOptions));
// app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// route imports
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/leaderBoard", leaderBoardRouter);
app.use("/api/v1/club", clubRouter);
//To handle unhandled route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global middleware to handle all sorts of errors
app.use(globalErrorHandler);
module.exports = app;
