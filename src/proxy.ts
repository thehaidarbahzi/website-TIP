import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET || "fallback_secret_key_for_local_development_12345";
const encodedKey = new TextEncoder().encode(secretKey);

async function getSessionPayload(request: NextRequest) {
  const cookie = request.cookies.get("session");
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie.value, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname === "/login" || pathname === "/pendaftaran") {
      const payload = await getSessionPayload(request);
      if (payload && typeof payload.user_role === "string") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (!pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }

    const payload = await getSessionPayload(request);

    if (!payload || typeof payload.user_role !== "string") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[PROXY ERROR]", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/pendaftaran"],
};
