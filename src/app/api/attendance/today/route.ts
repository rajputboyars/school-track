import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Attendance from "@/lib/models/Attendance";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET() {
  try {
    await connectDB();

    // ✅ Get today's date range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const data = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },

      // 👇 Join Student
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      // 👇 Join Class
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },

      // 👇 Join Subject
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },

      // ✅ Final response format
      {
        $project: {
          _id: 1,
          date: 1,
          status: 1,

          studentName: "$student.name",
          className: "$class.className",
          section: "$class.section",
          subjectName: "$subject.name",
        },
      },

      { $sort: { className: 1, studentName: 1 } },
    ]);

    return NextResponse.json(
      successResponse(data, "Today's attendance fetched")
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 500,
    });
  }
}