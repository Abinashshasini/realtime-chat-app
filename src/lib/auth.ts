import { NextAuthOptions } from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './dB';

// * Function to fetch google credentials from env * //
const getGoogleCredentintials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing google GOOGLE_CLIENT_ID');
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing google GOOGLE_CLIENT_SECRET');
  }

  return {
    clientId,
    clientSecret,
  };
};

/**
 * We are using redish for our data base
 * Adaptor: UpstashRedisAdapter will generate and store google credential in dB automatically when user trys to login using google
 * we are using google provider from next auth for login
 * we are using jwt for authentication token
 */
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentintials().clientId,
      clientSecret: getGoogleCredentintials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dBuser = (await db.get(`user:${token.id}`)) as User | null;
      if (!dBuser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dBuser.id,
        name: dBuser.name,
        email: dBuser.email,
        picture: dBuser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    redirect() {
      return '/dashboard';
    },
  },
};
