"use server";

import bcrypt from "bcryptjs";
import { getFirebaseAdminDb } from "../server/firebase";
import { createSession } from "../server/auth/sessions";
import { loginFormSchema } from "@/app/(utils)/zod/auth";

export async function loginUser(formData: FormData) {
  try {
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
        item.leaderPassword &&
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
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { message: "Terjadi kesalahan server" };
  }
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
  member1Wa?: string;
  member1Email?: string;
  member2Name?: string;
  member2Nim?: string;
  member2Wa?: string;
  member2Email?: string;
  leaderKtmFile?: any;
  member1KtmFile?: any;
  member2KtmFile?: any;
  ketuaFollowIgFile?: any;
  ketuaStoryIgFile?: any;
  ketuaTwibbonFile?: any;
  anggota1FollowIgFile?: any;
  anggota1StoryIgFile?: any;
  anggota1TwibbonFile?: any;
  anggota2FollowIgFile?: any;
  anggota2StoryIgFile?: any;
  anggota2TwibbonFile?: any;
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
      member1Wa: data.member1Wa || "",
      member1Email: data.member1Email || "",
      member2Name: data.member2Name || "",
      member2Nim: data.member2Nim || "",
      member2Wa: data.member2Wa || "",
      member2Email: data.member2Email || "",
      leaderKtmFile: data.leaderKtmFile || null,
      member1KtmFile: data.member1KtmFile || null,
      member2KtmFile: data.member2KtmFile || null,
      ketuaFollowIgFile: data.ketuaFollowIgFile || null,
      ketuaStoryIgFile: data.ketuaStoryIgFile || null,
      ketuaTwibbonFile: data.ketuaTwibbonFile || null,
      anggota1FollowIgFile: data.anggota1FollowIgFile || null,
      anggota1StoryIgFile: data.anggota1StoryIgFile || null,
      anggota1TwibbonFile: data.anggota1TwibbonFile || null,
      anggota2FollowIgFile: data.anggota2FollowIgFile || null,
      anggota2StoryIgFile: data.anggota2StoryIgFile || null,
      anggota2TwibbonFile: data.anggota2TwibbonFile || null,
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
