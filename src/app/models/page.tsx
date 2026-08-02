import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ChooseAIModelForm } from '@/components/ChooseAIModelForm';
import { ROUTES } from '@/lib/config';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ChooseModelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(ROUTES.login);
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12 w-full max-w-md">
      <h1 className="text-2xl uppercase tracking-[0.2em] text-[#dfdfe2]">
        Choose AI Provider
      </h1>

      <ChooseAIModelForm />
    </div>
  );
}
