import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import API_URL from "./helpers/api-url";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string) => {
  const decodedToken: {
    expires: number;
    id: string;
    username: string;
  } = jwtDecode(token);
  const currentTime = new Date().getTime() / 1000;
  if (decodedToken) {
    return decodedToken.expires < currentTime;
  } else {
    return true;
  }
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  if (token !== "") {
    if (isTokenExpired(token)) {
      return NextResponse.redirect(
        new URL(API_URL.PAGES.LOGIN, request.nextUrl)
      );
    } else {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${token}`);
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      return response;
    }
  } else {
    return NextResponse.redirect(new URL(API_URL.PAGES.LOGIN, request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/agents",
    "/events",
    "/alerts",
    "/tasks",
    "/users",
    "/control-directly",
    "/list-command",
    "/files",
  ],
};
