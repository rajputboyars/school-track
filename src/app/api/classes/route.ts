import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { createClass, getClasses } from "@/lib/services/class.service";
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

    const classes = await getClasses();

    return NextResponse.json(successResponse(classes));
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

    const newClass = await createClass(body);

    return NextResponse.json(successResponse(newClass, "Class created"));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}
