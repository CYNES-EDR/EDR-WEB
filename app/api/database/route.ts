import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { DATABASE } from "@/types/database";

export async function POST(request: NextRequest) {
  let searchParams = await request.json();
  const url = API_BACKEND.DATABASE.GET_DATABASE;
  let token = request.cookies.get("token")?.value || "";
  try {
    const res: { count: number; error: boolean; dbs: DATABASE[] } =
      await customAxiosPost(url, searchParams, token);
    if (res.error === false) {
      const response = NextResponse.json({
        success: true,
        database: res.dbs,
        count: res.count,
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
