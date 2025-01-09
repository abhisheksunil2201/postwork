import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Login() {
  const { status, data: session } = useSession();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch data from Go backend
      fetch("http://localhost:8080/your-go-endpoint", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Send the Auth0 token
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [session, status]);

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
          Signed in as {session.user.email} <br />
          <Button onClick={() => signOut()}>Sign out</Button>
          <div>
            <h2>Data from Go Backend:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
