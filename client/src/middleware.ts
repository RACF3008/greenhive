import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  // Redirect to /signin if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next(); // allow request to continue
}

export const config = {
  matcher: "/dashboard/:path",
};
