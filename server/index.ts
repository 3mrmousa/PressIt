import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import AppError from "./utils/errors/AppError.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import compressRouter from "./modules/compress/compress.routes.js";
import fakeSubscriptionRouter from "./modules/fake-subscription/fake-subscription.routes.js";
import adminRouter from "./modules/admin/admin.routes.js";
import SystemLog from "./modules/admin/log.model.js";
import { csrfMiddleware } from "./middlewares/csrf.middleware.js";

import { createServer } from "http";
import { Server } from "socket.io";



const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

export { io };

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(csrfMiddleware);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/compress", compressRouter);
app.use("/api/fake-subscription", fakeSubscriptionRouter);
app.use("/api/admin", adminRouter);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("unhandled error: ", err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Internal server error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    status,
    statusCode,
    message,
    errors,
  });

  SystemLog.create({
    level: "error",
    message: err.message || "Internal server error",
    meta: {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
    },
  }).then((newLog) => {
    io.emit("new-system-log", newLog);
  }).catch((dbErr) => console.error("Failed to log error to DB:", dbErr));
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("🚀 Server started on port", PORT);
      
    });
  })
  .catch((err: Error) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
