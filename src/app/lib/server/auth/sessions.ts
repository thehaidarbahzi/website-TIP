"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || "fallback_secret_key_for_local_development_12345";
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  user_id: string;
  user_name: string;
  user_role: "admin" | "juri" | "panitia" | "guest";
  category?: string;
  team_status?: string;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session:", error);
  }
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get("session");
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookie = await getSession();
  console.log("[getSessionUser] cookie exists?", !!cookie);
  if (!cookie) return null;
  const payload = await decrypt(cookie.value);
  console.log("[getSessionUser] payload:", payload);
  if (!payload || typeof payload.user_role !== "string") {
    console.log("[getSessionUser] invalid payload or missing user_role");
    return null;
  }
  return payload as unknown as SessionPayload;
}
