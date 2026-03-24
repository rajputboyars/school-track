import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/services/auth.service";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const data = await loginAdmin(email, password);

    const res = NextResponse.json(successResponse(data, "Login successful"));

    // Store token in cookie
    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: false,
      path: "/",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), {
      status: 400,
    });
  }
}