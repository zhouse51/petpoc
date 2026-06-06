import { SignIn } from "@clerk/nextjs";

import { SignInSessionOption } from "@/app/_components/sign-in-session-option";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <SignInSessionOption />
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              cardBox: "rounded-md shadow-sm",
            },
          }}
        />
      </div>
    </main>
  );
}
