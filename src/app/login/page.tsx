'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ButtonBase } from '@/components/ButtonBase';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/config';

const ERROR_DESCRIPTIONS: Record<string, string> = {
  AccessDenied: 'You do not have permission to sign in.',
  Configuration: 'There is a problem with the server configuration.',
  CredentialsSignin: 'Invalid credentials. Please try again.',
  Default: 'An unexpected error occurred.',
  Verification: 'The verification link may have expired or already been used.',
};

function SignInError() {
  const error = useSearchParams().get('error');

  if (!error) return null;

  const description = ERROR_DESCRIPTIONS[error] ?? ERROR_DESCRIPTIONS.Default;

  return (
    <div className="w-full max-w-sm rounded-lg border-l-4 border-destructive bg-[#ff5555]15 px-4 py-3 text-body text-[#dfdfe2]">
      {description}
    </div>
  );
}

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    redirect(ROUTES.main);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-4">
      <div className="text-center">
        <h1 className="text-3xl uppercase tracking-[0.2em] text-[#dfdfe2] sm:text-4xl">
          Code Review AI
        </h1>
        <p className="mt-4 text-body uppercase tracking-[0.3em] text-[#8d8d92]">
          Sign in to start reviewing
        </p>
      </div>
      <Suspense fallback={null}>
        <SignInError />
      </Suspense>
      <div className="flex flex-col items-center gap-4">
        <ButtonBase
          className="w-full"
          onClick={ () => signIn('github') }
          text={ 'Sign in with GitHub' }
          icon={ <GithubIcon /> }
        />
        <ButtonBase
          className="w-full"
          onClick={ () => signIn('google') }
          text={ 'Sign in with Google' }
          icon={ <GoogleIcon /> }
        />
      </div>
    </div>
  );
}