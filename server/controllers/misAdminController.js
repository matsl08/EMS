// * MIS Admin Controller
// @ file: Handles all MIS admin operations for user and course management

//* model imports
import { User } from "../models/User.js";
import Course from "../models/Course.js";
import Clearance from "../models/Clearance.js";
import Evaluation from "../models/Evaluation.js";
import OfferedCourse from "../models/OfferedCourse.js";
import Grade from "../models/Grade.js";
import Department from "../models/Department.js";
import { Payment } from "../models/Payment.js";

//* util imports
import { hashPassword } from "../utils/passwordManagement.js";

// ! User Management Controllers

// ? Create new user
export const createUser = async (req, res) => {
  try {
    const {
      role,
      studentId,
      facultyId,
      adminId,
      name,
      email,
      password,
      isActive = true,
      adminInfo,
      teacherInfo,
      studentInfo,
    } = req.body;

    // * Validate required fields based on role
    if (!role || !name || !password || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // * Create base user object with common fields
    const baseUserData = {
      name,
      email,
      password: await hashPassword(password),
      role,
      isActive,
    };

    // * Add role-specific fields
    switch (role) {
      case "student":
        if (!studentId || !studentInfo) {
          return res
            .status(400)
            .json({ message: "Student ID and information are required" });
        }
        baseUserData.studentId = studentId;
        baseUserData.studentInfo = studentInfo;
        break;

      case "teacher":
        if (!facultyId || !teacherInfo?.department) {
          return res
            .status(400)
            .json({ message: "Faculty ID and department are required" });
        }
        baseUserData.facultyId = facultyId;
        baseUserData.teacherInfo = teacherInfo;
        break;

      case "admin":
        if (!adminId || !adminInfo?.position) {
          return res
            .status(400)
            .json({ message: "Admin ID and position are required" });
        }
        baseUserData.adminId = adminId;
        baseUserData.adminInfo = adminInfo;
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const user = new User(baseUserData);
    await user.save();

    // * If creating a student, create their evaluation record
    if (role === "student") {
      const curriculumYear = parseInt(studentInfo.yearEnrolled);

      console.log("Finding courses with:", {
        programCode: studentInfo.programCode,
        curriculumYear: curriculumYear,
      });

      // Find all courses that match:
      // 1. Student's program code
      // 2. Student's curriculum year
      const courses = await Course.find({
        programCode: studentInfo.programCode,
        curriculumYear: curriculumYear,
      });

      console.log("Found courses:", courses);

      // Create evaluation record with empty grades for all program courses
      const evaluation = new Evaluation({
        studentId,
        courses: courses.map((course) => ({
          courseCode: course.courseCode,
          semesterOffered: course.semesterOffered,
          yearOffered: course.yearOffered,
          finalGrade: null,
          remarks: null,
        })),
      });
      await evaluation.save();

      // Create grade record with empty grades array
      const grade = new Grade({
        studentId,
        grades: [], // Empty array for now, will be populated when student enrolls in courses
        // paymentStatus and accessGranted will use default values from schema
      });
      await grade.save();

      console.log("Created evaluation:", evaluation);
      console.log("Created grade record:", grade);
    }

    // * Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "ID already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// ? Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by role-specific ID instead of MongoDB _id
    const user = await User.findOne({
      $or: [{ studentId: id }, { facultyId: id }, { adminId: id }],
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isActive, adminInfo, teacherInfo, studentInfo } =
      req.body;

    // * Find user by ID or role-specific ID
    const user = await User.findOne({
      $or: [{ studentId: id }, { facultyId: id }, { adminId: id }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // * Update common fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof isActive !== "undefined") user.isActive = isActive;

    // * Update role-specific fields
    switch (user.role) {
      case "admin":
        if (adminInfo && user.adminInfo) {
          user.adminInfo = {
            ...user.adminInfo.toObject(),
            ...adminInfo,
          };
        }
        break;

      case "teacher":
        if (teacherInfo && user.teacherInfo) {
          user.teacherInfo = {
            ...user.teacherInfo.toObject(),
            ...teacherInfo,
          };
        }
        break;

      case "student":
        if (studentInfo && user.studentInfo) {
          // * Merge nested objects carefully
          const currentStudentInfo = user.studentInfo.toObject();
          user.studentInfo = {
            ...currentStudentInfo,
            ...studentInfo,
            demographicProfile: studentInfo.demographicProfile
              ? {
                  ...currentStudentInfo.demographicProfile,
                  ...studentInfo.demographicProfile,
                }
              : currentStudentInfo.demographicProfile,
          };
        }
        break;
    }

    await user.save();

    // * Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "User updated successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the user to determine their role and ID
    const user = await User.findOne({
      $or: [{ studentId: id }, { facultyId: id }, { adminId: id }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user exists, delete them and their related data
    await User.findOneAndDelete({
      $or: [{ studentId: id }, { facultyId: id }, { adminId: id }],
    });

    // If it was a student, also delete their evaluation records
    if (user.role === "student") {
      await Evaluation.deleteOne({ studentId: user.studentId });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Reset user password (Admin only)
export const resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // * Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // * Hash and update password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Course Offering Management Controllers

// ? Create new offered course
export const createOfferedCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // * Verify if the course exists
    const baseCourse = await Course.findOne({
      courseCode: courseData.courseCode,
    });
    if (!baseCourse) {
      return res.status(404).json({ message: "Base course not found" });
    }

    // * Create offered course
    const offeredCourse = new OfferedCourse(courseData);
    await offeredCourse.save();

    res.status(201).json({
      message: "Course offering created successfully",
      offeredCourse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update offered course
export const updateOfferedCourse = async (req, res) => {
  try {
    const { edpCode } = req.params;
    const updates = req.body;

    const offeredCourse = await OfferedCourse.findOneAndUpdate(
      { edpCode },
      updates,
      { new: true }
    );

    if (!offeredCourse) {
      return res.status(404).json({ message: "Offered course not found" });
    }

    res.json({
      message: "Course offering updated successfully",
      offeredCourse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Get all offered courses
export const getOfferedCourses = async (req, res) => {
  try {
    const offeredCourses = await OfferedCourse.find();
    res.json(offeredCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Enroll student in offered course
export const enrollStudent = async (req, res) => {
  try {
    const { edpCode } = req.params;
    const { studentId } = req.body;

    // Find the offered course
    const course = await OfferedCourse.findOne({ edpCode });
    if (!course) {
      return res.status(404).json({ message: "Course offering not found" });
    }

    // Check if student exists
    const student = await User.findOne({ studentId, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if student is already enrolled
    if (course.studentsEnrolled.some((s) => s.studentId === studentId)) {
      return res
        .status(400)
        .json({ message: "Student already enrolled in this course" });
    }

    // Add student to course
    course.studentsEnrolled.push({ studentId });
    await course.save();

    // Update or create grade record
    let gradeRecord = await Grade.findOne({ studentId });

    // If no grade record exists, create one
    if (!gradeRecord) {
      gradeRecord = new Grade({
        studentId,
        grades: [],
      });
    }

    // Add course to grades array if not already present
    if (!gradeRecord.grades.some((g) => g.edpCode === edpCode)) {
      gradeRecord.grades.push({
        edpCode,
        midtermGrade: null,
        finalGrade: null,
        remarks: null,
      });
      await gradeRecord.save();
    }

    // Create or update clearance record
    let clearanceRecord = await Clearance.findOne({ studentId });

    if (!clearanceRecord) {
      clearanceRecord = new Clearance({
        studentId,
        clearances: [],
      });
    }

    // Add course to clearances if not already present
    if (!clearanceRecord.clearances.some((c) => c.courseCode === edpCode)) {
      clearanceRecord.clearances.push({
        courseCode: edpCode,
        teacherId: course.teacherAssigned,
        status: "Pending", // Default status
        remarks: null, // Default remarks
      });
      await clearanceRecord.save();
    }

    // Check if payment record already exists for this student and school year/semester
    const existingPayment = await Payment.findOne({
      studentId,
      schoolYear: course.schoolYear,
      semester: course.semester,
    });

    // Only create a new payment record if one doesn't exist
    if (!existingPayment) {
      const paymentRecord = new Payment({
        studentId,
        schoolYear: course.schoolYear,
        semester: course.semester,
        payments: [
          {
            midterm: {
              amount: course.amount || 0, // Use course amount or default to 0
              status: "Pending",
              datePaid: null,
              receiptNumber: null,
            },
            final: {
              amount: course.amount || 0, // Use course amount or default to 0
              status: "Pending",
              datePaid: null,
              receiptNumber: null,
            },
          },
        ],
      });
      await paymentRecord.save();
    }

    res.json({ message: "Student enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Add this controller function
export const dropStudent = async (req, res) => {
  try {
    const { edpCode, studentId } = req.params;

    // Find the offered course
    const course = await OfferedCourse.findOne({ edpCode });
    if (!course) {
      return res.status(404).json({ message: "Course offering not found" });
    }

    // Check if student is enrolled
    const studentIndex = course.studentsEnrolled.findIndex(
      (s) => s.studentId === studentId
    );
    if (studentIndex === -1) {
      return res
        .status(404)
        .json({ message: "Student not enrolled in this course" });
    }

    // Remove student from course
    course.studentsEnrolled.splice(studentIndex, 1);
    await course.save();

    // Remove course from student's grade record
    const gradeRecord = await Grade.findOne({ studentId });
    if (gradeRecord) {
      gradeRecord.grades = gradeRecord.grades.filter(
        (g) => g.edpCode !== edpCode
      );
      await gradeRecord.save();
    }

    // Remove course from student's clearance record
    const clearanceRecord = await Clearance.findOne({ studentId });
    if (clearanceRecord) {
      clearanceRecord.clearances = clearanceRecord.clearances.filter(
        (c) => c.courseCode !== edpCode
      );
      await clearanceRecord.save();
    }

    res.json({ message: "Student dropped from course successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Department Management Controllers

// ? Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Create new department
export const createDepartment = async (req, res) => {
  try {
    const departmentData = req.body;
    const department = new Department(departmentData);
    await department.save();

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update department
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Course Management Controllers

// ? Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Create new course
export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // * Check if department exists
    const department = await Department.findOne({
      departmentCode: courseData.department,
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update course
export const updateCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const course = await Course.findOneAndUpdate({ courseCode }, req.body, {
      new: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const course = await Course.findOneAndDelete({ courseCode });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
