import { NextRequest, NextResponse } from "next/server";
import { customAxiosGet, customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { USER } from "@/types/user";
export async function POST(request: NextRequest) {
  let dataParams = await request.json();
  const url = API_BACKEND.USER.SIGN_UP;
  let token = request.cookies.get("token")?.value || "";
  try {
    const users: { user: USER; error: boolean } = await customAxiosPost(
      url,
      dataParams,
      token
    );
    if (!users.error) {
      const response = NextResponse.json({
        error: false,
        user: users.user,
      });
      return response;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
