import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const userDataCookie = request.cookies.get("user_data")?.value;

  let role: string | null = null;

  if (userDataCookie) {
    try {
      const user = JSON.parse(userDataCookie);
      role = user.role;
    } catch (err) {
      console.error("Invalid user_data cookie");
    }
  }

  const pathname = request.nextUrl.pathname;

  // Protect /user routes: must be logged in
  if (pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /admin routes: must be admin
  if (pathname.startsWith("/admin")) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request
  return NextResponse.next();
}

// Apply only to these routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
