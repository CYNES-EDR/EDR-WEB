import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { TASK } from "@/types/task";

export async function POST(request: NextRequest) {
  let searchParams = await request.json();
  const url = API_BACKEND.TASK.GET_TASKS;
  let token = request.cookies.get("token")?.value || "";
  try {
    const res: { count: number; error: boolean; tasks: TASK[] } =
      await customAxiosPost(url, searchParams, token);
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        tasks: res.tasks,
        count: res.count,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
