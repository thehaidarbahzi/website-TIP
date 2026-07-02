import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const isLoggedIn = await auth();
  const pathname = req.nextUrl.pathname;

  const authPages = ["/login"];

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
