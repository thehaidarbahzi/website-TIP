import z from "zod";

export const loginFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();

export const registerFormSchema = z
  .object({
    category: z.string().min(1),
    teamName: z.string().min(1),
    institution: z.string().min(1),
    leaderName: z.string().min(1),
    leaderNim: z.string().min(1),
    leaderWa: z.string().min(1),
    leaderEmail: z.string().email(),
    leaderPassword: z.string().min(6),
    member1Name: z.string().optional().default(""),
    member1Nim: z.string().optional().default(""),
    member2Name: z.string().optional().default(""),
    member2Nim: z.string().optional().default(""),
  })
  .strict();
