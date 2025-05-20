// * Importing Required Modules
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

// * Route Imports
import authRoutes from "./routes/authRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import teacherRoutes from "./routes/teacherRoute.js";
import misAdminRoutes from "./routes/misAdminRoute.js";
import registrarAdminRoutes from "./routes/registrarAdminRoute.js";
import accountingAdminRoutes from "./routes/accountingAdminRoute.js";

// * Environment Setup
config();

// * Initialize Database and Redis
await Promise.all([connectDB(), connectRedis()]).catch((error) => {
  console.error("Failed to initialize services:", error);
  process.exit(1);
});

const app = express();

// * Middleware Configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

// * Route Configuration
// ? Public Routes
app.use("/api/auth", authRoutes);

// ? Protected Routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

// ? Admin Routes
app.use("/api/admin/mis", misAdminRoutes);
app.use("/api/admin/registrar", registrarAdminRoutes);
app.use("/api/admin/accounting", accountingAdminRoutes);

// * Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// * Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
