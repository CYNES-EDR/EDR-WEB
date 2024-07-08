import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  let searchParams = await request.json();
  let active: any = {};
  let deactivate: any = {};

  active.filter = [...searchParams["filter"]];
  deactivate["filter"] = [...searchParams["filter"]];
  active.filter.push({
    field: "is_active",
    operator: "=",
    value: "true",
  });
  deactivate["filter"].push({
    field: "is_active",
    operator: "=",
    value: "false",
  });
  console.log(active, deactivate);
  const url = API_BACKEND.TASK.GET_TASKS;
  try {
    const activeCount: { count: number; error: boolean } =
      await customAxiosPost(url, active, token);
    const deactivateCount: { count: number; error: boolean } =
      await customAxiosPost(url, deactivate, token);
    if (activeCount.error === false && deactivateCount.error === false) {
      const response = NextResponse.json({
        success: true,
        data: {
          active: active.count,
          deactivate: deactivate.count,
        },
      });
      return response;
    } else return "Error";
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
