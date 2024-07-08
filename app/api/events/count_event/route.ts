import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { ALERT } from "@/types/alert";
export async function POST(request: NextRequest) {
  const url = API_BACKEND.EVENTS.COUNT_EVENTS;
  let searchParams = await request.json();
  let token = request.cookies.get("token")?.value || "";

  try {
    const res: { count: number; error: boolean; msg: string | null } =
      await customAxiosPost(url, searchParams, token);
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        msg: res.msg,
        count: res.count,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
