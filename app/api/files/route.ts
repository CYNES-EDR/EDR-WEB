import { NextRequest, NextResponse } from "next/server";
import { customAxiosGet, customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
import { FILE } from "@/types/file";

export async function POST(request: NextRequest) {
  let searchParams = await request.json();
  console.log(searchParams);
  const url = API_BACKEND.FILES.GET_FILES;
  let token = request.cookies.get("token")?.value || "";
  try {
    const files: { files: FILE[]; count: number; error: boolean } =
      await customAxiosPost(url, searchParams, token);
    if (!files.error) {
      const response = NextResponse.json({
        success: true,
        files: files.files,
        count: files.count,
      });
      return response;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
