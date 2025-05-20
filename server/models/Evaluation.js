import mongoose, { Schema } from "mongoose";

const evaluationSchema = new Schema({
  evaluationId: { type: Schema.Types.ObjectId, auto: true },
  studentId: { type: String, ref: "User.studentId" },
  courses: [
    {
      courseCode: { type: String, ref: "Course" },
      semesterOffered: Number,
      yearOffered: Number,
      finalGrade: Number,
      remarks: String, //"Passed", "Failed"
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;
