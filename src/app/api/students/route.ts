import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Student from "@/lib/models/Student";
import { createStudent } from "@/lib/services/student.service";
import {
  successResponse,
  errorResponse,
} from "@/lib/utils/response";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const classId = searchParams.get("classId");
    const search = searchParams.get("search");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const query: any = {};

    if (classId) query.classId = classId;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate("classId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Student.countDocuments(query),
    ]);

    return NextResponse.json(
      successResponse(
        {
          students,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
        "Students fetched successfully"
      )
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse(error.message),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const student = await createStudent(body);

    return NextResponse.json(
      successResponse(student, "Student created successfully")
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse(error.message),
      { status: 400 }
    );
  }
}