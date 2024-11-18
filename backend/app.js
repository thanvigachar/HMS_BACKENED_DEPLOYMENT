const express = require("express");
const dbConnection = require("./database/dbConnection.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { errorMiddleware } = require("./middleware/err.js");
const messageRouter = require("./router/message_router.js");
const userRouter = require("./router/user_router.js");
const appointmentRouter = require("./router/appointment_router.js");

const app = express();
dotenv.config({ path: "./config/config.env" });

// CORS configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middleware for parsing cookies and JSON
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Route handlers
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Database connection
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
