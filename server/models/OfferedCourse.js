import mongoose from "mongoose";

const offeredCourseSchema = new mongoose.Schema({
  edpCode: {
    type: String,
    unique: true,
    required: true,
  },
  courseCode: {
    type: String,
    ref: "Course",
    required: true,
  },
  schoolYear: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  schedule: {
    day: {
      type: String,
      enum: [
        "M",
        "T",
        "W",
        "Th",
        "F",
        "Sat",
        "Sun",
        "M-S",
        "M-F",
        "MWF",
        "TTh",
        "TThS",
        "MW",
      ],
    },
    time: String,
    room: String,
  },
  teacherAssigned: {
    type: String,
    ref: "User.facultyId",
  },
  studentsEnrolled: [
    {
      studentId: { type: String, ref: "User.studentId" },
    },
  ],
});

const OfferedCourse = mongoose.model("OfferedCourse", offeredCourseSchema);

export default OfferedCourse;
