import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Attendance from "@/lib/models/Attendance";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const classId = searchParams.get("classId");
    const studentId = searchParams.get("studentId");

    const match: any = {};

    if (classId) match.classId = classId;
    if (studentId) match.studentId = studentId;

    const report = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$studentId",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          total: 1,
          present: 1,
          percentage: {
            $multiply: [{ $divide: ["$present", "$total"] }, 100],
          },
        },
      },
    ]);

    return NextResponse.json(
      successResponse(report, "Report generated successfully")
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 500,
    });
  }
}