import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import React from "react";

interface AppState {
    Component: React.FC,
    pageProps: {
        session: Session
    }
}

export default function App({
    Component,
    pageProps: {
        session,
        ...pageProps
    },
}: AppState) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}