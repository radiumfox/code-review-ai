import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

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
    secret: NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
