import NextAuth from "next-auth"

declare module "next-auth" {
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
      isProfileComplete?: boolean | null
      lastPostingConfirmedAt?: Date | string | null
      employeeId?: string | null
      bloodGroup?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    phone?: string | null
    designation?: string | null
    posting?: string | null
    imageUrl?: string | null
    role?: string | null
    isProfileComplete?: boolean | null
    lastPostingConfirmedAt?: Date | string | null
    employeeId?: string | null
    bloodGroup?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | null
    phone?: string | null
    designation?: string | null
    posting?: string | null
    imageUrl?: string | null
    role?: string | null
    isProfileComplete?: boolean | null
    lastPostingConfirmedAt?: Date | string | null
    employeeId?: string | null
    bloodGroup?: string | null
  }
} 