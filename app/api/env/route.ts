import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const socketUrl = process.env.SOCKET_URL;
  return NextResponse.json({ socketUrl: socketUrl }, { status: 200 });
}
