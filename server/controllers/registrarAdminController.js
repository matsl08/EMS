// * Registrar Admin Controller
// @ file: Handles all registrar admin operations

import Evaluation from "../models/Evaluation.js";
import {} from "../models/User.js";

// * Student Management Controllers

// ? Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("studentId name studentInfo")
      .lean();

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * Evaluation Management Controllers

// ? Get student evaluation
export const getStudentEvaluation = async (req, res) => {
  try {
    const { studentId } = req.params;
    const evaluation = await Evaluation.findOne({ studentId });

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Update student evaluation
export const updateStudentEvaluation = async (req, res) => {
  try {
    const { studentId } = req.params;
    const evaluationData = req.body;

    const evaluation = await Evaluation.findOneAndUpdate(
      { studentId },
      evaluationData,
      { new: true, upsert: true }
    );

    res.json({
      message: "Evaluation updated successfully",
      evaluation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
