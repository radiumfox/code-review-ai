import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { CodeEditor } from '@/features/codeEditor';
import { ReviewsList } from '@/features/codeEditor/ReviewsList';
import { ROUTES } from '@/lib/config';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(ROUTES.login);
  }

  return (
    <div className="flex h-[calc(100vh-71px)] w-full">
      <ReviewsList className="w-80 shrink-0 hidden lg:block overflow-auto" />
      <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4">
        <h1 className="hidden">
          Code Review AI
        </h1>
        <CodeEditor />
      </div>
    </div>
  );
}