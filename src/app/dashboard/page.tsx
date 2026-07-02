import { auth } from "@/auth";
import Image from "next/image";
import { ButtonLogout } from "../_components/button";

export default async function Page() {
  const session = await auth();

  return (
    <>
      <ButtonLogout />

      {session?.user ? (
        <>
          <h1>{session?.user.name}</h1>
          <h1>{session?.user.email}</h1>
          {session?.user.image && (
            <Image
              src={session.user.image}
              alt="User Photo"
              width={50}
              height={50}
              className="rounded-4xl"
            />
          )}
          <h1>{session?.expires}</h1>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
