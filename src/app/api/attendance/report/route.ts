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

    // const report = await Attendance.aggregate([
    //   { $match: match },
    //   {
    //     $group: {
    //       _id: "$studentId",
    //       total: { $sum: 1 },
    //       present: {
    //         $sum: {
    //           $cond: [{ $eq: ["$status", "present"] }, 1, 0],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       total: 1,
    //       present: 1,
    //       percentage: {
    //         $multiply: [{ $divide: ["$present", "$total"] }, 100],
    //       },
    //     },
    //   },
    // ]);
    const report = await Attendance.aggregate([
      { $match: match },

      // Join Student
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      // Join Class
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },

      // Join Subject
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },

      // Group by student + subject
      {
        $group: {
          _id: {
            studentId: "$studentId",
            subjectId: "$subjectId",
          },
          name: { $first: "$student.name" },
          className: { $first: "$class.name" },
          section: { $first: "$class.section" },
          subjectName: { $first: "$subject.name" },

          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
        },
      },

      // Final format
      {
        $project: {
          _id: 0,
          name: 1,
          className: 1,
          section: 1,
          subjectName: 1,
          total: 1,
          present: 1,
          percent: {
            $round: [
              { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
              0,
            ],
          },
        },
      },
    ]);
    return NextResponse.json(
      successResponse(report, "Report generated successfully"),
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 500,
    });
  }
}
