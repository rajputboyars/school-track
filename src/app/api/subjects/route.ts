import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import {
  createSubject,
  getSubjects,
} from "@/lib/services/subject.service";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { getToken, verifyToken } from "@/lib/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
 const token = getToken(req);
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized - No token"), {
        status: 401,
      });
    }

    verifyToken(token); // ✅ safe here (Node runtime)
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    const query: any = {};
    if (classId) query.classId = classId;

    const subjects = await getSubjects(query);

    return NextResponse.json(successResponse(subjects));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
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

    const subject = await createSubject(body);

    return NextResponse.json(successResponse(subject, "Subject created"));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}