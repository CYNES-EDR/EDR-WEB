import { NextRequest, NextResponse } from "next/server";
import { customAxiosGet } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export interface Root {
  error: boolean;
  msg: any;
  task: Task;
}

export interface Task {
  id: string;
  group_id: number;
  group_name: string;
  command_id: number;
  command_name: string;
  receive_agents: Object;
  is_active: boolean;
  updated_at: string;
  created_at: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let token = request.cookies.get("token")?.value || "";
  console.log(token);
  const id = params.id;
  const url = API_BACKEND.TASK.ADD_TASK + `/${id}`;
  try {
    const res: { res: Task } = await customAxiosGet(url, {}, token);
    const response = NextResponse.json(res);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
