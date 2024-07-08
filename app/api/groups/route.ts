import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { GROUP } from "@/types/group";

export async function POST(request: NextRequest) {
  let searchParams = await request.json();
  let token = request.cookies.get("token")?.value || "";
  const url = API_BACKEND.GROUP.GET_GROUPS;
  try {
    const res: { count: number; error: boolean; groups: GROUP[] } =
      await customAxiosPost(url, searchParams, token);
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        groups: res.groups,
        count: res.count,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
