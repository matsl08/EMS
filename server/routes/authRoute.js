// server/routes/authRoutes.js
import { Router } from "express";
import {
  login,
  logout,
  getMe,
  refreshToken,
  updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// * Authentication Routes
// ? Login, logout, and check authentication status

router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/refresh", refreshToken);
router.put("/password", protect, updatePassword);

export default router;
