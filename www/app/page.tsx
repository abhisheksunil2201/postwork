"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          console.log(accessToken);

          const response = await fetch("http://localhost:8080/api/data", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Postwork</p>
        {!isAuthenticated && (
          <>
            Not signed in <br />
            <button onClick={() => loginWithRedirect()}>
              Sign in with Auth0
            </button>
          </>
        )}
        {isAuthenticated && (
          <>
            Signed in as {user?.email} <br />
            <button onClick={() => logout()}>Sign out</button>
            <div>
              <h2>Data from Go Backend:</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
