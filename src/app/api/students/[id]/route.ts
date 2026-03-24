import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { updateStudent, deleteStudent } from "@/lib/services/student.service";
import { successResponse, errorResponse } from "@/lib/utils/response";
import Student from "@/lib/models/Student";
import { getToken, verifyToken } from "@/lib/utils/jwt";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const token = getToken(req);
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized - No token"), {
        status: 401,
      });
    }

    verifyToken(token); // ✅ safe here (Node runtime)
    const { id } = await context.params; // ✅ FIX

    const student = await Student.findById(id).populate("classId");

    if (!student) {
      throw new Error("Student not found");
    }

    return NextResponse.json(
      successResponse(student, "Student fetched successfully"),
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const token = getToken(req);
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized - No token"), {
        status: 401,
      });
    }

    verifyToken(token); // ✅ safe here (Node runtime)
    const { id } = await context.params; // ✅ FIX
    const body = await req.json();

    const updated = await updateStudent(id, body);

    return NextResponse.json(successResponse(updated, "Student updated"));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const token = getToken(req);
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized - No token"), {
        status: 401,
      });
    }

    verifyToken(token); // ✅ safe here (Node runtime)
    const { id } = await context.params; // ✅ FIX
    await deleteStudent(id);

    return NextResponse.json(successResponse(null, "Student deleted"));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}
