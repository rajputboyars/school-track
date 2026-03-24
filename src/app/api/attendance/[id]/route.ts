import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Attendance from "@/lib/models/Attendance";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await req.json();

    const updated = await Attendance.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json(
      successResponse(updated, "Attendance updated successfully")
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await Attendance.findByIdAndDelete(id);

    return NextResponse.json(
      successResponse(null, "Attendance deleted successfully")
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}