import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { markAttendance } from "@/lib/services/attendance.service";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const result = await markAttendance(body);

    return NextResponse.json(
      successResponse(result, "Attendance marked successfully")
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}