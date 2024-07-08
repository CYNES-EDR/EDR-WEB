import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { COMMAND } from "@/types/command";

export async function POST(request: NextRequest) {
  let searchParams = await request.json();
  const url = API_BACKEND.COMMAND.GET_COMMAND;
  let token = request.cookies.get("token")?.value || "";
  try {
    const res: { count: number; error: boolean; commands: COMMAND[] } =
      await customAxiosPost(url, searchParams, token);
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        commands: res.commands,
        count: res.count,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
