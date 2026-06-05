"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { RefreshCcw } from "lucide-react";

import type { EchoResponse } from "@/models/echo";
import { Button } from "@/app/_components/ui/button";

type EchoState =
  | { status: "idle" | "loading"; data?: undefined; error?: undefined }
  | { status: "success"; data: EchoResponse; error?: undefined }
  | { status: "error"; data?: undefined; error: string };

export function EchoPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [state, setState] = useState<EchoState>({ status: "idle" });

  const displayName = useMemo(() => {
    if (!user) return "Signed-in user";
    return user.fullName || user.username || user.firstName || "Signed-in user";
  }, [user]);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const loadEcho = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;

    setState({ status: "loading" });

    try {
      const token = await getToken();
      const params = new URLSearchParams({
        name: displayName,
        email,
      });

      const response = await fetch(`/echo?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Echo failed with ${response.status}`);
      }

      const data = (await response.json()) as EchoResponse;
      setState({ status: "success", data });
    } catch (error) {
      setState({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Unable to call the echo API",
      });
    }
  }, [displayName, email, getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadEcho();
  }, [loadEcho]);

  return (
    <section className="w-full max-w-2xl rounded-md border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Signed in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The backend echoed your Clerk-authenticated identity.
          </p>
        </div>
        <Button
          aria-label="Refresh echo"
          onClick={loadEcho}
          size="icon"
          variant="secondary"
          disabled={state.status === "loading"}
          title="Refresh echo"
        >
          <RefreshCcw
            aria-hidden="true"
            className={state.status === "loading" ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />
        </Button>
      </div>

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md bg-muted p-4">
          <dt className="font-medium text-muted-foreground">Name</dt>
          <dd className="mt-1 break-words text-base font-semibold">
            {state.status === "success" ? state.data.name : displayName}
          </dd>
        </div>
        <div className="rounded-md bg-muted p-4">
          <dt className="font-medium text-muted-foreground">Email</dt>
          <dd className="mt-1 break-words text-base font-semibold">
            {state.status === "success" ? state.data.email : email || "No email"}
          </dd>
        </div>
      </dl>

      {state.status === "error" ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </section>
  );
}
