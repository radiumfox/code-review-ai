import NextAuth, { DefaultSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { type CallbacksOptions } from 'next-auth';
import { UserModel } from '@/models/User';
import { UserRole } from '@/lib/types';
import { ObjectId } from 'mongodb';

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

declare module 'next-auth' {
    interface Profile {
        login: string, id: number
    }
    interface Session {
      user: { id: ObjectId } & DefaultSession['user'];
    }
}

if(!GITHUB_ID || !GITHUB_SECRET){
  throw new Error('Missing GitHub ID or GitHub secret environment variable');
}

if(!NEXTAUTH_SECRET){
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    })
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;

      return token;
    },
    async session({ session, token }) {
      if(session.user) {
        session.user.id = token.id as ObjectId;
      }

      return session;
    },
    async signIn ({ user, profile }) {
      if(!user.email) return false;

      try {
        const currentUser = await UserModel.findOne({ email: user.email });

        if(!currentUser){
          const newUser = await UserModel.create({
            name: user.name,
            email: user.email,
            role: UserRole.User,
            githubUsername: profile?.login,
            githubId: profile?.id
          });

          user.id = newUser._id.toString();
        } else {
          user.id = currentUser._id.toString();
        }
      } catch (error) {
        console.error(error);
      }
      return true;
    }
  } satisfies Partial<CallbacksOptions>
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
