import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    id?: string
  }
  
  interface Session {
    user: {
      id?: string
      role?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}