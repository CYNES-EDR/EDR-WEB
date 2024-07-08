import { NextRequest, NextResponse } from "next/server";
import { customAxiosDelete, customAxiosGet } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
type DEL_RESPONSE = {
  error: boolean;
  msg: string;
};
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let token = request.cookies.get("token")?.value || "";
  const id = params.id;
  const url = API_BACKEND.AGENT.DELETE_AGENT + `/${id}`;
  try {
    const res: { res: DEL_RESPONSE } = await customAxiosDelete(url, token);
    const response = NextResponse.json(res);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let token = request.cookies.get("token")?.value || "";
  const id = params.id;
  const url = API_BACKEND.AGENT.GET_DETAIL_AGENT + `/${id}`;
  try {
    const res: any = await customAxiosGet(url, {}, token);
    const response = NextResponse.json(res);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
