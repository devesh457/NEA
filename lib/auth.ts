import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Check if user is approved
        if (!user.isApproved) {
          throw new Error("Your account is pending approval. Please contact the administrator.");
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Always fetch fresh user data from database
      if (token.email) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              designation: true,
              posting: true,
              imageUrl: true,
              role: true,
              isProfileComplete: true,
              lastPostingConfirmedAt: true,
              employeeId: true,
              bloodGroup: true,
              isApproved: true
            }
          });

          if (freshUser) {
            token.id = freshUser.id;
            token.name = freshUser.name;
            token.phone = freshUser.phone;
            token.designation = freshUser.designation;
            token.posting = freshUser.posting;
            token.imageUrl = freshUser.imageUrl;
            token.role = freshUser.role;
            token.isProfileComplete = freshUser.isProfileComplete;
            token.lastPostingConfirmedAt = freshUser.lastPostingConfirmedAt;
            token.employeeId = freshUser.employeeId;
            token.bloodGroup = freshUser.bloodGroup;
            token.isApproved = freshUser.isApproved;
          }
        } catch (error) {
          console.error('Error fetching fresh user data:', error);
        }
      }
      
      // Handle initial login case
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.designation = user.designation;
        token.posting = user.posting;
        token.imageUrl = user.imageUrl;
        token.role = user.role;
        token.isProfileComplete = user.isProfileComplete;
        token.lastPostingConfirmedAt = user.lastPostingConfirmedAt;
        token.employeeId = user.employeeId;
        token.bloodGroup = user.bloodGroup;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone;
        session.user.designation = token.designation;
        session.user.posting = token.posting;
        session.user.imageUrl = token.imageUrl;
        session.user.role = token.role;
        session.user.isProfileComplete = token.isProfileComplete;
        session.user.lastPostingConfirmedAt = token.lastPostingConfirmedAt;
        session.user.employeeId = token.employeeId;
        session.user.bloodGroup = token.bloodGroup;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
}; 