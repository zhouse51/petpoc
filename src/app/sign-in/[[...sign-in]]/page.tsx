import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            cardBox: "rounded-md shadow-sm",
          },
        }}
      />
    </main>
  );
}
