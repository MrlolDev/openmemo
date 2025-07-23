import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import memoriesRouter from "./routes/memories";
import usersRouter from "./routes/users";
import morgan from "morgan";
import authRouter from "./routes/auth";
import { authMiddleware } from "./middleware/auth";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Rate limiting - separate limits for auth and other endpoints
const generalLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 50, // 50 requests per 30 seconds
});

const authLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 100, // 100 auth requests per 30 seconds
  message: "Too many authentication requests, please try again later.",
});

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Make Prisma client available to routes
app.use((req, res, next) => {
  (req as any).prisma = prisma;
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes with specific rate limiting
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/memories", generalLimiter, authMiddleware, memoriesRouter);
app.use("/api/users", generalLimiter, authMiddleware, usersRouter);

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 OpenMemo API server running on http://localhost:${PORT}`);
});

export default app;
