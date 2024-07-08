import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { EVENT } from "@/types/event";
export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  let searchParams = await request.json();
  const url = API_BACKEND.EVENTS.GET_EVENTS;
  try {
    const res: { count: number; error: boolean; events: EVENT[] } =
      await customAxiosPost(url, searchParams, token);
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        events: res.events,
        count: res.count,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
