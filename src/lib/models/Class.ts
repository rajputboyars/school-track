import mongoose, { Schema, models } from "mongoose";

const ClassSchema = new Schema(
  {
    className: { type: String, required: true },
    section: { type: String },
  },
  { timestamps: true }
);

export default models.Class || mongoose.model("Class", ClassSchema);