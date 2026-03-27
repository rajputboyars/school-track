import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Attendance from "@/lib/models/Attendance";
import { normalizeDate } from "@/lib/utils/date";
import { successResponse, errorResponse } from "@/lib/utils/response";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const classId = searchParams.get("classId");
    const subjectId = searchParams.get("subjectId");
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");
    const query: any = {};
    if (classId) query.classId = new mongoose.Types.ObjectId(classId);
    if (subjectId) query.subjectId = new mongoose.Types.ObjectId(subjectId);
    if (studentId) query.studentId = new mongoose.Types.ObjectId(studentId);
    if (date) query.date = normalizeDate(date);

    const data = await Attendance.find(query)
      .populate("studentId")
      .populate("subjectId")
      .sort({ date: -1 });

    return NextResponse.json(
      successResponse(data, "Attendance fetched successfully")
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 500,
    });
  }
}