import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { AGENT } from "@/types/agent";

export async function POST(request: NextRequest) {
  let searchParams = await request.json();
  let token = request.cookies.get("token")?.value || "";
  const url = API_BACKEND.AGENT.GET_AGENTS;
  try {
    const agents: { count: number; error: boolean; agents: AGENT[] } =
      await customAxiosPost(url, searchParams, token);
    const response = NextResponse.json({
      success: true,
      data: agents,
      count: agents.count,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
