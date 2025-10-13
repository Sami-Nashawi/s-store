// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Fake users (replace with DB check)
        if (credentials?.username === "manager" && credentials?.password === "1234") {
          return { id: "1", name: "Manager", role: "manager" };
        }
        if (credentials?.username === "worker" && credentials?.password === "1234") {
          return { id: "2", name: "Worker", role: "worker" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
