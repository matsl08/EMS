// server/routes/accountingAdminRoutes.js
import { Router } from "express";
import {
  protect,
  authorizeAdminPosition,
} from "../middleware/authMiddleware.js";
import {
  getPayments,
  getStudentPayments,
  updatePaymentStatus,
} from "../controllers/accountingAdminController.js";

const router = Router();

// * Accounting Admin Routes
// ? All routes require Accounting admin authentication

router.use(protect);
router.use(authorizeAdminPosition("accounting"));

// * Payment Management
// ? Get and update payment status for students
router.get("/payments", getPayments);
router.get("/payments/:studentId", getStudentPayments);
router.put("/payments/:studentId", updatePaymentStatus);

export default router;
