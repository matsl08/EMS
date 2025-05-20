// server/routes/teacherRoutes.js
import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAssignedCourses,
  uploadGrades,
  uploadGradesFromFile,
  getCourseClearances,
  updateClearanceStatus,
} from "../controllers/teacherController.js";

const router = Router();

// * Teacher Routes
// ? All routes require teacher authentication

router.use(protect);
router.use(authorize("teacher"));

// * Course Management
// ? Get all assigned courses
router.get("/courses", getAssignedCourses);

// * Grade Management
// ? Upload grades manually or via file
router.post("/courses/:edpCode/grades", uploadGrades);
router.post("/courses/:edpCode/grades/upload", uploadGradesFromFile);

// * Clearance Management
// ? Get and update clearance status for students
router.get("/courses/:edpCode/clearance", getCourseClearances);
router.put("/courses/:edpCode/clearance/:studentId", updateClearanceStatus);

export default router;
