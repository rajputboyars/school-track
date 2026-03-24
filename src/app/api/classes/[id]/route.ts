import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { updateClass, deleteClass } from "@/lib/services/class.service";
import { successResponse, errorResponse } from "@/lib/utils/response";
import Class from "@/lib/models/Class";
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
    const { id } = await context.params; // ✅ FIX HERE
    const data = await Class.findById(id);

    if (!data) {
      throw new Error("Class not found");
    }

    return NextResponse.json(
      successResponse(data, "Class fetched successfully"),
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
    const body = await req.json();
    const { id } = await context.params; // ✅ FIX HERE
    const updated = await updateClass(id, body);

    return NextResponse.json(successResponse(updated, "Class updated"));
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
    const { id } = await context.params; // ✅ FIX HERE
    await deleteClass(id);

    return NextResponse.json(successResponse(null, "Class deleted"));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}
