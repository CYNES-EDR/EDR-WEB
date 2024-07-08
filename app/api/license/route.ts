import { NextRequest, NextResponse } from "next/server";
import { customAxiosGet, customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
export interface RES {
  msg: Msg;
  status: boolean;
}

export interface Msg {
  credentials: string;
  expires: number;
  id_device: string;
}

export async function GET(request: NextRequest) {
  const url = API_BACKEND.LICENSE.CHECK_LICENSE;
  try {
    const res: RES = await customAxiosGet(url);

    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
