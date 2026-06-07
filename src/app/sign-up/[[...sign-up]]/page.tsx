import type { ReactElement } from "react";

import { SignUpAgreement } from "@/app/_components/sign-up-agreement";

const SignUpPage = (): ReactElement => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <SignUpAgreement />
    </main>
  );
};

export default SignUpPage;
