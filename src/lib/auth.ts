import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** ส่ง code ไปที่ client ผ่าน query (signIn จะได้ result.code) */
class InvalidCredentials extends CredentialsSignin {
  code = "invalid_credentials";
}

class OAuthOnlyAccount extends CredentialsSignin {
  code = "oauth_only";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Required behind Railway / reverse proxy so OAuth + cookies use the public URL
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) throw new InvalidCredentials();

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) throw new InvalidCredentials();

        if (!user.password) throw new OAuthOnlyAccount();

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new InvalidCredentials();

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          referralCode: user.referralCode,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        const rc = (user as { referralCode?: string }).referralCode;
        if (rc) {
          token.referralCode = rc;
        } else {
          const row = await prisma.user.findUnique({
            where: { id: user.id },
            select: { referralCode: true, role: true },
          });
          token.referralCode = row?.referralCode ?? "";
          token.role = row?.role ?? token.role;
        }
      }
      // OAuth / บางกรณีใส่ user id ใน sub แต่ไม่ได้ mirror มา token.id
      if (!token.id && token.sub) {
        token.id = token.sub as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const id =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" && token.sub) ||
          "";
        session.user.id = id;
        session.user.role = (token.role as string) ?? "USER";
        session.user.referralCode = (token.referralCode as string) ?? "";
      }
      return session;
    },
  },
});
