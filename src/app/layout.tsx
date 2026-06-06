import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { SessionPersistenceGuard } from "@/app/_components/session-persistence-guard";

import "./globals.css";

export const metadata: Metadata = {
  title: "PetPOC",
  description: "Clerk-secured Next.js and Vercel Functions proof of concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0f766e",
          colorText: "#191816",
          borderRadius: "8px",
        },
      }}
    >
      <html lang="en">
        <body>
          <SessionPersistenceGuard>{children}</SessionPersistenceGuard>
        </body>
      </html>
    </ClerkProvider>
  );
}
