import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  let searchParams = await request.json();
  let window7 = {
    filter: [
      ...searchParams.filter,
      {
        field: "os",
        operator: "like",
        value: "%win7%",
      },
    ],
  };

  let window8 = {
    filter: [
      ...searchParams.filter,
      {
        field: "os",
        operator: "like",
        value: "%Windows 8%",
      },
    ],
  };
  let window10 = {
    filter: [
      ...searchParams.filter,
      {
        field: "os",
        operator: "like",
        value: "%Windows 10%",
      },
    ],
  };
  let window11 = {
    filter: [
      ...searchParams.filter,
      {
        field: "os",
        operator: "like",
        value: "%Windows 11%",
      },
    ],
  };
  const url = API_BACKEND.AGENT.COUNT_AGENTS;
  try {
    const window7Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, window7, token);
    const window8Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, window8, token);
    const window10Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, window10, token);
    const window11Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, window11, token);
    if (window7Count.error === false && window8Count.error === false) {
      const response = NextResponse.json({
        success: true,
        data: {
          window7: window7Count.count,
          window8: window8Count.count,
          window10: window10Count.count,
          window11: window11Count.count,
        },
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
