import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { status, data } = useSession();
  return (
    <div>
      {status === "unauthenticated" && (
        <>
          Not signed in <br />
          <Button onClick={() => signIn("auth0")}>Sign in with Auth0</Button>
        </>
      )}
      {status === "loading" && <p>Loading...</p>}
      {status === "authenticated" && (
        <>
          Signed in as {data.user.email} <br />
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      )}
    </div>
  );
}
