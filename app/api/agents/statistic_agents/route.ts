import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  let searchParams = await request.json();
  let online = {
    filter: [
      {
        field: "last_seen",
        operator: ">", //"<=" -> offline
        value: searchParams,
      },
    ],
  };

  let offline = {
    filter: [
      {
        field: "last_seen",
        operator: "<=", //"<=" -> offline
        value: searchParams,
      },
    ],
  };

  const url = API_BACKEND.AGENT.COUNT_AGENTS;
  try {
    const onlineCount: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, online, token);
    const offlineCount: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, offline, token);

    if (onlineCount.error === false && offlineCount.error === false) {
      const response = NextResponse.json({
        success: true,
        data: {
          online: onlineCount.count,
          offline: offlineCount.count,
        },
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
