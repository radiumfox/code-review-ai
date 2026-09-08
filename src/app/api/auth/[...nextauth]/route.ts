import NextAuth, { DefaultSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { type CallbacksOptions } from 'next-auth';
import { UserModel } from '@/models/User';
import { AuthProvider, UserRole } from '@/lib/types';
import { connectToDatabase } from '@/lib/api';
import { ROUTES } from '@/lib/config';

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

declare module 'next-auth' {
    interface Profile {
        login?: string, id?: number, sub?: string
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

if(!GOOGLE_ID || !GOOGLE_SECRET){
  console.warn('Missing Google ID or Google secret environment variable; Google sign-in will be disabled');
}

if(!NEXTAUTH_SECRET){
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

class SignInRejectedError extends Error {}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    ...(GOOGLE_ID && GOOGLE_SECRET
      ? [GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      })]
      : []),
  ],
  secret: NEXTAUTH_SECRET,
  pages: {
    error: ROUTES.login,
  },
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
          await connectToDatabase();

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
          await connectToDatabase();

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
    async signIn ({ user, account, profile }) {
      if(!user.email) return false;

      try {
        await connectToDatabase();

        const isGoogle = account?.provider === AuthProvider.Google;
        const providerFields = isGoogle
          ? { googleId: profile?.sub, provider: AuthProvider.Google }
          : { githubUsername: profile?.login, githubId: profile?.id, provider: AuthProvider.Github };

        const existingUser = await UserModel.findOne({ email: user.email });
        const existingProvider = existingUser?.provider ?? AuthProvider.Github;

        if (existingUser && existingProvider !== account?.provider) {
          const originalProvider = existingProvider === AuthProvider.Google ? 'Google' : 'GitHub';
          throw new SignInRejectedError(
            `This email is already registered with ${originalProvider}. Please sign in with ${originalProvider} instead.`
          );
        }

        await UserModel.findOneAndUpdate({ email: user.email }, {
          $set: {
            name: user.name,
            email: user.email,
            ...providerFields
          },
          $setOnInsert: {
            role: UserRole.User
          }
        }, { upsert: true });

        return true;
      } catch (error) {
        if (error instanceof SignInRejectedError) {
          throw error;
        }

        console.error(error);
        return false;
      }
    }
  } satisfies Partial<CallbacksOptions>
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
