import { MSG } from "./../../../../types/msg";
import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
type USER_RES = {
  error: boolean;
  msg: MSG;
  tokens: {
    access: string;
    refresh: string;
  };
};
export async function POST(request: NextRequest) {
  const url = API_BACKEND.USER.LOGIN;
  try {
    const reqBody = await request.json();
    const { user_name, password } = reqBody;
    const user: USER_RES = await customAxiosPost(
      url,
      { user_name, password },
      ""
    );
    // login check response
    if (user.msg !== "success") {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    //create token data
    const token = user.tokens.access;
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: false,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
