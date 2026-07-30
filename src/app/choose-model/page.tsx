import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ChooseAIModelForm } from '@/components/ChooseAIModelForm';

export default function ChooseModelPage() {
  const session = getServerSession();

  if (!session) {
    redirect('/login');
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
