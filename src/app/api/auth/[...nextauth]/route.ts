import NextAuth, { DefaultSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { type CallbacksOptions } from 'next-auth';
import { UserModel } from '@/models/User';
import { UserRole } from '@/lib/types';

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

declare module 'next-auth' {
    interface Profile {
        login: string, id: number
    }
    interface Session {
      user: { id: string; aiModel: string | null } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        aiModel: string | null;
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
    async session({ session, token }) {
      if(session.user) {
        session.user.id = token.id;
        session.user.aiModel = token.aiModel ?? null;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if(trigger === 'update') {
        token.aiModel = session?.aiModel ?? null;
        return token;
      }

      if(user?.email) {
        try {
          const currentUser = await UserModel.findOne({ email: user.email });

          if(currentUser) {
            token.id = currentUser._id.toString();
            token.aiModel = currentUser.aiModel ?? null;
          }
        } catch (error) {
          console.error(error);
        }
      } else if(!token.id) {
        try {
          const currentUser = token.email
            ? await UserModel.findOne({ email: token.email })
            : null;

          if(currentUser) {
            token.id = currentUser._id.toString();
            token.aiModel = currentUser.aiModel ?? null;
          }
        } catch (error) {
          console.error(error);
        }
      }

      return token;
    },
    async signIn ({ user, profile }) {
      if(!user.email) return false;

      try {
        await UserModel.findOneAndUpdate({ email: user.email }, {
          name: user.name,
          email: user.email,
          role: UserRole.User,
          githubUsername: profile?.login,
          githubId: profile?.id
        }, { upsert: true });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  } satisfies Partial<CallbacksOptions>
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
