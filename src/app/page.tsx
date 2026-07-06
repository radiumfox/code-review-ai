import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor/CodeEditor';

import { fetchModels } from '@/lib/gen-ai';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const {
    models: initialModels,
    nextPageToken: initialNextPageToken
  } = await fetchModels();

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
      <CodeEditor initialModels={initialModels} initialNextPageToken={initialNextPageToken} />
    </div>
  );
}