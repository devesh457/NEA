import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    phone?: string | null
    designation?: string | null
    posting?: string | null
    imageUrl?: string | null
    role?: string | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
      designation?: string | null
      posting?: string | null
      imageUrl?: string | null
      role?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone?: string | null
    designation?: string | null
    posting?: string | null
    imageUrl?: string | null
    role?: string | null
  }
} 