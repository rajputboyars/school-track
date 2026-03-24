import mongoose, { Schema, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
  },
  { timestamps: true }
);

// Prevent duplicate attendance
AttendanceSchema.index(
  { studentId: 1, subjectId: 1, date: 1 },
  { unique: true }
);

export default models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);