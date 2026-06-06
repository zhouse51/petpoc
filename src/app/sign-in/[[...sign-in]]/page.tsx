import type { ReactElement } from "react";

import { SignInWithPersistenceOption } from "@/app/_components/sign-in-with-persistence-option";

const SignInPage = (): ReactElement => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <SignInWithPersistenceOption />
    </main>
  );
};

export default SignInPage;
