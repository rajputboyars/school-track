import mongoose, { Schema, models } from "mongoose";

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default models.Student || mongoose.model("Student", StudentSchema);