import mongoose, { Schema, models } from "mongoose";

const SubjectSchema = new Schema(
  {
    subjectName: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  },
  { timestamps: true }
);

export default models.Subject || mongoose.model("Subject", SubjectSchema);