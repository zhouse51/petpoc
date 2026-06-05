import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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
}
