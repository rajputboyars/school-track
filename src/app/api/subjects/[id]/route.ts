import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { deleteSubject } from "@/lib/services/subject.service";
import { successResponse, errorResponse } from "@/lib/utils/response";
import Subject from "@/lib/models/Subject";
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

    const subject = await Subject.findById(id).populate("classId");

    if (!subject) {
      throw new Error("Subject not found");
    }

    return NextResponse.json(
      successResponse(subject, "Subject fetched successfully"),
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

    const updated = await Subject.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json(
      successResponse(updated, "Subject updated successfully"),
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  content: { params: Promise<{ id: string }> },
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
    const { id } = await content.params;
    await deleteSubject(id);

    return NextResponse.json(successResponse(null, "Subject deleted"));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}
