"use client";

import { useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

const storageKey = "petpoc.keepSignedIn";
const transientSessionKey = "petpoc.transientSessionActive";

export function SessionPersistenceGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const keepSignedIn = window.localStorage.getItem(storageKey);
    const transientSessionActive = window.sessionStorage.getItem(transientSessionKey);

    if (keepSignedIn === "false" && transientSessionActive !== "true") {
      void signOut({ redirectUrl: "/sign-in" });
    }
  }, [isLoaded, isSignedIn, signOut]);

  return children;
}
