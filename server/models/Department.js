import mongoose, { Schema } from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentId: { type: Schema.Types.ObjectId, auto: true },
  name: String,
  departmentCode: String,
  departmentHead: String,
  programs: [
    {
      programCode: String,
      programName: String,
    },
  ],
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
