import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    async signIn() {
      // You can add custom logic here
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, account }) {
      // Add the access token to the JWT
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
