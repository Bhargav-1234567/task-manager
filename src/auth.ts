import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verifyUser } from '@/lib/users'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'EmailPassword',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        const user = await verifyUser(credentials.email, credentials.password)
        if (!user) return null
        return user
      },
    }),
  ],
  pages: {
    signIn: '/login', // use our custom page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
  // You can add cookies, csrf, etc., if needed.
})
