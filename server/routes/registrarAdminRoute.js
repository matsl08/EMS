// server/routes/registrarAdminRoutes.js
import { Router } from "express";
import {
  protect,
  authorizeAdminPosition,
} from "../middleware/authMiddleware.js";
import {
  getStudentEvaluation,
  updateStudentEvaluation,
} from "../controllers/registrarAdminController.js";

const router = Router();

// ! Registrar Admin Routes
// ? All routes require Registrar admin authentication

router.use(protect);
router.use(authorizeAdminPosition("registrar"));

// ! Evaluation Management
// ? Get and update student evaluations
router.get("/evaluations/:studentId", getStudentEvaluation);
router.put("/evaluations/:studentId", updateStudentEvaluation);

export default router;
