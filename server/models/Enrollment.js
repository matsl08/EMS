import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: { type: Schema.Types.ObjectId, auto: true },
  studentId: { type: String, ref: "User.studentId" },
  semester: Number,
  yearLevel: Number,
  courses: [
    {
      edpCode: { type: String, ref: "OfferedCourse" },
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
