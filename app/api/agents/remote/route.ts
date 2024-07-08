import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  let searchParams = await request.json();
  const url = API_BACKEND.AGENT.REMOTE_AGENT;
  try {
    const res: { error: boolean; msg: string } = await customAxiosPost(
      url,
      searchParams,
      token
    );
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        msg: res.msg,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
