"use server";

import bcrypt from "bcryptjs";
import { getFirebaseAdminDb } from "../server/firebase";
import { createSession } from "../server/auth/sessions";
import { loginFormSchema } from "@/app/(utils)/zod/auth";

export async function loginUser(formData: FormData) {
  const val = loginFormSchema.safeParse(Object.fromEntries(formData));

  if (!val.success) {
    return { message: val.error.message };
  }

  const db = getFirebaseAdminDb();
  const email = val.data.email;
  const password = val.data.password;

  const usersSnapshot = await db.ref("users").once("value");
  const users = usersSnapshot.val() as Record<
    string,
    { email: string; password: string; name: string; role: string }
  > | null;

  if (users) {
    const found = Object.entries(users).find(
      ([, u]) =>
        u.email === email && bcrypt.compareSync(password, u.password),
    );
    if (found) {
      const [, userData] = found;
      await createSession({
        user_id: email,
        user_name: userData.name,
        user_role: userData.role as "admin" | "juri",
      });
      return { redirect: "/dashboard" };
    }
  }

  const pesertaSnapshot = await db.ref("peserta").once("value");
  const peserta = pesertaSnapshot.val();

  if (!peserta) {
    return { message: "Email atau password salah" };
  }

  const user = (Object.values(peserta) as Array<Record<string, string>>).find(
    (item) =>
      item.leaderEmail === email &&
      bcrypt.compareSync(password, item.leaderPassword),
  );

  if (!user) {
    return { message: "Email atau password salah" };
  }

  if (user.status === "rejected") {
    return { message: "Tim Anda telah ditolak. Silakan hubungi panitia." };
  }

  await createSession({
    user_id: user.leaderEmail,
    user_name: user.teamName,
    user_role: "guest",
    category: user.category || "",
    team_status: (user.status as string) || "pending",
  });

  return { redirect: "/dashboard" };
}

export async function registerUser(data: {
  category: string;
  teamName: string;
  institution: string;
  leaderName: string;
  leaderNim: string;
  leaderWa: string;
  leaderEmail: string;
  leaderPassword: string;
  member1Name?: string;
  member1Nim?: string;
  member2Name?: string;
  member2Nim?: string;
  leaderKtmFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  member1KtmFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  member2KtmFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  buktiPembayaran?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
}) {
  try {
    const hash = bcrypt.hashSync(data.leaderPassword, 10);

    const payload = {
      category: data.category,
      teamName: data.teamName,
      institution: data.institution,
      leaderName: data.leaderName,
      leaderNim: data.leaderNim,
      leaderWa: data.leaderWa,
      leaderEmail: data.leaderEmail,
      leaderPassword: hash,
      member1Name: data.member1Name || "",
      member1Nim: data.member1Nim || "",
      member2Name: data.member2Name || "",
      member2Nim: data.member2Nim || "",
      leaderKtmFile: data.leaderKtmFile,
      member1KtmFile: data.member1KtmFile,
      member2KtmFile: data.member2KtmFile,
      buktiPembayaran: data.buktiPembayaran,
      registeredAt: new Date().toISOString(),
      status: "pending",
    };

    const db = getFirebaseAdminDb();
    await db.ref(`peserta/${payload.teamName}`).set(payload);

    return { ok: true, teamName: payload.teamName };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal mendaftarkan tim";
    return { ok: false, error: message };
  }
}

export async function logoutUser() {
  const { deleteSession } = await import("../server/auth/sessions");
  await deleteSession();
}

export async function getCurrentUser() {
  const { getSessionUser } = await import("../server/auth/sessions");
  return getSessionUser();
}

export async function getMyTeam() {
  const { getSessionUser } = await import("../server/auth/sessions");
  const session = await getSessionUser();
  if (!session || session.user_role !== "guest") return null;

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref(`peserta/${session.user_name}`).once("value");
  const data = snapshot.val();
  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { leaderPassword, ...safe } = data;
  return safe;
}
