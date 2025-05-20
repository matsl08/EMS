import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    sparse: true,
    unique: true,
    required: false,
    default: undefined,
  },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true,
  },

  isActive: { type: Boolean, default: true },

  studentId: { type: String, unique: true, sparse: true },
  facultyId: { type: String, unique: true, sparse: true },
  adminId: { type: String, unique: true, sparse: true },

  studentInfo: {
    studentNumber: String,
    programCode: { type: String, ref: "Department.programs" },
    yearEnrolled: Number,
    yearLevel: Number,
    demographicProfile: {
      gender: { type: String, enum: ["male", "female"] },
      dateOfBirth: Date,
      personWithDisability: { type: Boolean, default: false },
      civilStatus: String,
      placeOfBirth: String,
      religion: String,
      parents: [
        {
          role: { type: String, enum: ["father", "mother", "guardian"] },
          name: String,
        },
      ],
      address: [
        {
          provinceAddress: String,
          cityAddress: String,
        },
      ],
      contactInformation: [
        {
          emailAddress: String,
          mobileNumber: String,
          landLineNumber: String,
        },
      ],
      supportingStudies: {
        type: String,
        enum: [
          "parents",
          "self support",
          "part self",
          "gov't / private business",
          "university scholarship",
        ],
      },
      isEmployed: Boolean,
      company: {
        name: String,
        address: String,
      },
      educationalBackground: [
        {
          elementary: String,
          secondary: String,
          isTransferree: Boolean,
          college: {
            name: String,
            lastSemesterAttended: Number,
            course: String,
            dateGraduated: Date,
            extraCurricularActivities: String,
          },
        },
      ],
      otherInformation: String,
    },
  },

  teacherInfo: {
    department: { type: String, ref: "Department" },
  },

  adminInfo: {
    position: { type: String, enum: ["mis", "registrar", "accounting"] },
  },
});

export const User = mongoose.model("User", userSchema);
