import { Router } from "express";
import {
  protect,
  authorizeAdminPosition,
} from "../middleware/authMiddleware.js";
import {
  //? user management
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  //? offered courses management
  createOfferedCourse,
  updateOfferedCourse,
  getOfferedCourses,
  resetUserPassword,
  enrollStudent,
  dropStudent,
  //? department management
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  //? course management
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/misAdminController.js";

const router = Router();

// ! MIS Admin Routes
// ? All routes require MIS admin authentication

router.use(protect);
router.use(authorizeAdminPosition("mis"));

// ! User Management
// ? CRUD operations for user accounts
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.post("/users/:id/reset-password", resetUserPassword);
router.delete("/users/:id", deleteUser);

// ! Course Offering Management
// ? Create and manage offered courses
router.post("/courses/offered", createOfferedCourse);
router.put("/courses/offered/:edpCode", updateOfferedCourse);
router.get("/courses/offered", getOfferedCourses);
router.post("/courses/offered/:edpCode/enroll", enrollStudent);
router.delete("/courses/offered/:edpCode/enroll/:studentId", dropStudent);

// ! Department Management
// ? CRUD operations for departments
router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// ! Course Management
// ? CRUD operations for courses
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.put("/courses/:courseCode", updateCourse);
router.delete("/courses/:courseCode", deleteCourse);

export default router;
