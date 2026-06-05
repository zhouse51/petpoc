import { auth } from "@clerk/nextjs/server";

import { AccountMenu } from "@/app/_components/account-menu";
import { EchoPanel } from "@/app/_components/echo-panel";

export default async function Home() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-sm font-semibold tracking-normal">PetPOC</p>
          <AccountMenu />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 py-10">
        <EchoPanel />
      </div>
    </main>
  );
}
