"use client";

import ButtonBase from "@/components/ButtonBase";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation";

export default function LoginPage() {
    const githubIcon = GithubIcon();

    const { data: session } = useSession();

    if(session) {
        redirect("/");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-4">
            <div className="text-center">
                <h1 className="text-3xl uppercase tracking-[0.2em] text-[#dfdfe2] sm:text-4xl">
                    Code Review AI
                </h1>
                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#8d8d92]">
                    Sign in to start reviewing
                </p>
            </div>
            <ButtonBase onClick={ signIn } text={'Sign in with GitHub'} icon={githubIcon} />
        </div>
    );
}
