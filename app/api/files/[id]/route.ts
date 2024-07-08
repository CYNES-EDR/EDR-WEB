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
  const url = API_BACKEND.FILES.DELETE_FILE + `/${id}`;
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
  const data = params.id;
  const [id, fileName] = data.split(",");
  const url = API_BACKEND.FILES.DOWNLOAD_FILE + `/${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return new NextResponse(response.body, {
      headers: {
        ...response.headers, // copy the previous headers
        "content-disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
