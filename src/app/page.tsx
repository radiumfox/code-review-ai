import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { CodeEditor } from '@/components/CodeEditor';
import { ReviewsList } from '@/components/ReviewsList';
import { ROUTES } from '@/lib/config';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(ROUTES.login);
  }

  return (
    <div className="flex h-[calc(100vh-71px)] w-full">
      <ReviewsList className="w-80 shrink-0 hidden lg:block overflow-auto" />
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 overflow-y-auto">
        <div className="w-full px-3 sm:px-6 md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}