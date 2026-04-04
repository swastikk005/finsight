import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        }) as any

        if (!user || !user.password) {
          throw new Error("No user found")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        return user
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
