"use client";

import { signIn, signOut } from "next-auth/react";

function ButtonLogin() {
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-white text-black p-4 w-fit cursor-pointer"
    >
      Sign in with Google
    </button>
  );
}

function ButtonLogout() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-white text-black p-4 w-fit cursor-pointer"
    >
      Sign Out
    </button>
  );
}

export { ButtonLogin, ButtonLogout };
