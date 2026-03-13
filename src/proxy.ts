import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired, executeRefresh } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const isRoot = request.nextUrl.pathname === "/";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLogin = request.nextUrl.pathname.startsWith("/login");

  let accessToken = request.cookies.get("accessToken")?.value;
  let refreshToken = request.cookies.get("refreshToken")?.value;
  let tokenRefreshed = false;

  // 1. Handle Token Refresh logic
  if (accessToken && isTokenExpired(accessToken)) {
    if (refreshToken) {
      const refreshedData = await executeRefresh(refreshToken);
      if (refreshedData) {
        accessToken = refreshedData.accessToken;
        refreshToken = refreshedData.refreshToken;
        tokenRefreshed = true;
      } else {
        accessToken = undefined;
      }
    } else {
      accessToken = undefined;
    }
  }

  // 2. Redirect logic
  if (isRoot) {
    const url = accessToken
      ? new URL("/dashboard", request.url)
      : new URL("/login", request.url);
    const response = NextResponse.redirect(url);
    if (tokenRefreshed) {
      applyCookies(response, accessToken, refreshToken);
    }
    return response;
  }

  if (isDashboard && !accessToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Explicitly clear cookies only if they were present in request but we nullified them
    if (request.cookies.has("accessToken")) {
      applyCookies(response, undefined, undefined);
    }
    return response;
  }

  if (isLogin && accessToken && !isTokenExpired(accessToken)) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    if (tokenRefreshed) {
      applyCookies(response, accessToken, refreshToken);
    }
    return response;
  }

  // 3. Final path - avoid modifying cookies on login submit (POST) to prevent collisions
  const response = NextResponse.next();
  if (tokenRefreshed) {
    applyCookies(response, accessToken, refreshToken);
  }
  return response;
}

function applyCookies(
  res: NextResponse,
  access: string | undefined,
  refresh: string | undefined,
) {
  if (access && refresh) {
    res.cookies.set("accessToken", access, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.cookies.set("refreshToken", refresh, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } else {
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
