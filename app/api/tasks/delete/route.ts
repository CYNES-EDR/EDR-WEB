import { NextRequest, NextResponse } from "next/server";
import { customAxiosDelete } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";

export async function POST(request: NextRequest) {
  let dataParams = await request.json();
  const url = API_BACKEND.TASK.ADD_TASK + `/${dataParams.id}`;
  let token = request.cookies.get("token")?.value || "";
  try {
    const res: { error: boolean; msg: string } = await customAxiosDelete(
      url,
      token
    );
    return NextResponse.json({
      error: res.error,
      msg: res.msg,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
