import type { ReactElement } from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = (): ReactElement => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            cardBox: "rounded-md shadow-sm",
          },
        }}
      />
    </main>
  );
};

export default SignUpPage;
