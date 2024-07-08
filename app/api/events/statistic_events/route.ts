import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  let searchParams = await request.json();
  let lv1: any = {};
  let lv2: any = {};
  let lv3: any = {};
  lv1.filter = [...searchParams["filter"]];
  lv2["filter"] = [...searchParams["filter"]];
  lv3["filter"] = [...searchParams["filter"]];
  lv1.filter.push({
    field: "event_level",
    operator: "=",
    value: "1",
  });
  lv2["filter"].push({
    field: "event_level",
    operator: "=",
    value: "2",
  });
  lv3["filter"].push({
    field: "event_level",
    operator: "=",
    value: "3",
  });
  const url = API_BACKEND.EVENTS.COUNT_EVENTS;
  try {
    const lv1Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, lv1, token);
    const lv2Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, lv2, token);
    const lv3Count: { count: number; error: boolean; msg: string } =
      await customAxiosPost(url, lv3, token);
    if (
      lv1Count.error === false &&
      lv2Count.error === false &&
      lv3Count.error === false
    ) {
      const response = NextResponse.json({
        success: true,
        data: {
          hight: lv3Count.count,
          medium: lv2Count.count,
          low: lv1Count.count,
        },
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
