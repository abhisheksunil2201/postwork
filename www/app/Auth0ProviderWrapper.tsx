"use client"; // Mark this as a Client Component

import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";

export default function Auth0ProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL!,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
