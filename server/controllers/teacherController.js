// * Teacher Controller
// @ file: Handles all teacher-related operations

import { User } from "../models/User.js";
import TeacherGrade from "../models/TeacherGrade.js";
import OfferedCourse from "../models/OfferedCourse.js";
import Clearance from "../models/Clearance.js";

// * Course Management Controllers

// ? Get teacher's assigned courses
export const getAssignedCourses = async (req, res) => {
  try {
    const courses = await OfferedCourse.find({
      teacherAssigned: req.user.facultyId,
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No assigned courses found" });
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * Grade Management Controllers

// ? Upload grades for a specific course
export const uploadGrades = async (req, res) => {
  try {
    const { edpCode } = req.params;
    const { term, grades } = req.body;

    // * Verify if teacher is assigned to this course
    const course = await OfferedCourse.findOne({
      edpCode,
      teacherAssigned: req.user.facultyId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not assigned to teacher" });
    }

    // * Create or update grade entry
    const teacherGrade = await TeacherGrade.findOneAndUpdate(
      {
        teacher: req.user.facultyId,
        edpCode,
        term,
      },
      {
        teacher: req.user.facultyId,
        edpCode,
        term,
        grades,
        updatedAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Grades uploaded successfully", teacherGrade });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Upload grades from file
export const uploadGradesFromFile = async (req, res) => {
  try {
    const { edpCode } = req.params;
    // ! Note: Actual file processing would be handled by middleware
    const { term, grades } = req.body;

    // * Verify if teacher is assigned to this course
    const course = await OfferedCourse.findOne({
      edpCode,
      teacherAssigned: req.user.facultyId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not assigned to teacher" });
    }

    // * Create or update grade entry
    const teacherGrade = await TeacherGrade.findOneAndUpdate(
      {
        teacher: req.user.facultyId,
        edpCode,
        term,
      },
      {
        teacher: req.user.facultyId,
        edpCode,
        term,
        grades,
        updatedAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Grades uploaded successfully from file",
      teacherGrade,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * Clearance Management Controllers

// ? Get clearance list for a course
export const getCourseClearances = async (req, res) => {
  try {
    const { edpCode } = req.params;

    // * Verify if teacher is assigned to this course
    const course = await OfferedCourse.findOne({
      edpCode,
      teacherAssigned: req.user.facultyId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not assigned to teacher" });
    }

    // * Get clearance records for all students in the course
    const clearances = await Clearance.find({
      "clearances.courseCode": edpCode,
    });

    res.json(clearances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update student's clearance status
export const updateClearanceStatus = async (req, res) => {
  try {
    const { edpCode, studentId } = req.params;
    const { status, remarks } = req.body;

    // * Verify if teacher is assigned to this course
    const course = await OfferedCourse.findOne({
      edpCode,
      teacherAssigned: req.user.facultyId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not assigned to teacher" });
    }

    // * Update clearance status
    const clearance = await Clearance.findOneAndUpdate(
      {
        studentId,
        "clearances.courseCode": edpCode,
      },
      {
        $set: {
          "clearances.$.status": status,
          "clearances.$.remarks": remarks,
        },
      },
      { new: true }
    );

    if (!clearance) {
      return res.status(404).json({ message: "Clearance record not found" });
    }

    res.json({ message: "Clearance status updated successfully", clearance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
