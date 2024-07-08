import { NextRequest, NextResponse } from "next/server";
import { customAxiosGet, customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { USER } from "@/types/user";
export async function POST(request: NextRequest) {
  const url = API_BACKEND.USER.GET_USERS;
  let token = request.cookies.get("token")?.value || "";
  try {
    const users: { users: USER[]; count: number; error: boolean } =
      await customAxiosGet(url, {}, token);
    if (!users.error) {
      const response = NextResponse.json({
        success: true,
        users: users.users,
        count: users.count,
      });
      return response;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
