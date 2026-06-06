"use client";

import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { RefreshCcw } from "lucide-react";

import type { EchoResponse } from "@/models/echo";
import type { UserResponse } from "@/models/users";
import { Button } from "@/app/_components/ui/button";

type DashboardState =
  | { status: "idle" | "loading"; data?: undefined; error?: undefined }
  | {
      status: "success";
      data: {
        echo: EchoResponse;
        user: UserResponse;
      };
      error?: undefined;
    }
  | { status: "error"; data?: undefined; error: string };

export const EchoPanel = (): ReactElement => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [state, setState] = useState<DashboardState>({ status: "idle" });

  const displayName = useMemo<string>((): string => {
    if (!user) return "Signed-in user";
    return user.fullName || user.username || user.firstName || "Signed-in user";
  }, [user]);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const loadDashboardData = useCallback(async (): Promise<void> => {
    if (!isLoaded || !isSignedIn || !user?.id) return;

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
        const body = await response.json().catch((): Record<string, never> => ({}));
        throw new Error(body.error ?? `Echo failed with ${response.status}`);
      }

      const data = (await response.json()) as EchoResponse;

      const sharedHeaders = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const registerResponse = await fetch("/v1/users/register", {
        method: "POST",
        headers: sharedHeaders,
        body: JSON.stringify({ name: data.name }),
      });

      if (!registerResponse.ok) {
        const body = await registerResponse
          .json()
          .catch((): Record<string, never> => ({}));
        throw new Error(
          body.error ?? `User registration failed with ${registerResponse.status}`,
        );
      }

      const userResponse = await fetch(
        `/v1/users/${encodeURIComponent(user.id)}`,
        {
          method: "GET",
          headers: sharedHeaders,
        },
      );

      if (!userResponse.ok) {
        const body = await userResponse
          .json()
          .catch((): Record<string, never> => ({}));
        throw new Error(body.error ?? `User lookup failed with ${userResponse.status}`);
      }

      const dbUser = (await userResponse.json()) as UserResponse;
      setState({ status: "success", data: { echo: data, user: dbUser } });
    } catch (error) {
      setState({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Unable to call the echo API",
      });
    }
  }, [displayName, email, getToken, isLoaded, isSignedIn, user?.id]);

  useEffect((): void => {
    void loadDashboardData();
  }, [loadDashboardData]);

  return (
    <section className="w-full max-w-5xl py-6 text-foreground">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 text-sm sm:text-base">
          <p className="break-words">
            <span className="font-semibold">Echo:</span>{" "}
            {state.status === "success"
              ? `${state.data.echo.name}, ${state.data.echo.email}`
              : `${displayName}, ${email || "No email"}`}
          </p>
          <p className="break-words">
            <span className="font-semibold">User from DB:</span>{" "}
            {state.status === "success"
              ? `${state.data.user.auth_user_id}, ${state.data.user.name}`
              : "Loading..."}
          </p>
        </div>
        <Button
          aria-label="Refresh"
          onClick={loadDashboardData}
          size="icon"
          variant="secondary"
          disabled={state.status === "loading"}
          title="Refresh"
        >
          <RefreshCcw
            aria-hidden="true"
            className={state.status === "loading" ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />
        </Button>
      </div>

      {state.status === "error" ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </section>
  );
};
