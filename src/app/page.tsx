"use client";

import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <button className="btn" onClick={() => signIn("google")}>
      EEEEEEEEEEEEE
    </button>
  );
}
