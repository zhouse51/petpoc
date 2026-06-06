import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { echoRequestSchema } from "@/models/echo";
import { upsertAppUser } from "@/services/repositories/app-users";

type ClerkSessionClaims = {
  name?: string;
  fullName?: string;
  email?: string;
  emailAddress?: string;
  primary_email_address?: string;
  firstName?: string;
  lastName?: string;
  given_name?: string;
  family_name?: string;
};

export async function handleEchoGet(request: NextRequest) {
  const { isAuthenticated, sessionClaims, userId } = await auth({
    acceptsToken: "session_token",
  });

  if (!isAuthenticated || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedQuery = echoRequestSchema.safeParse({
    name: request.nextUrl.searchParams.get("name") ?? undefined,
    email: request.nextUrl.searchParams.get("email") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        error: "Invalid echo query",
        details: parsedQuery.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const claims = (sessionClaims ?? {}) as ClerkSessionClaims;
  const user = await currentUser();
  const fallbackName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    parsedQuery.data.name ||
    "Signed-in user";
  const fallbackEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses.at(0)?.emailAddress ||
    parsedQuery.data.email ||
    "unknown@example.invalid";

  const claimName =
    claims.name ||
    claims.fullName ||
    [claims.firstName ?? claims.given_name, claims.lastName ?? claims.family_name]
      .filter(Boolean)
      .join(" ");
  const claimEmail =
    claims.email ||
    claims.emailAddress ||
    claims.primary_email_address;

  const name = claimName || fallbackName;
  const email = claimEmail || fallbackEmail;

  await upsertAppUser({
    clerkUserId: userId,
    email,
    name,
  });

  return NextResponse.json({
    name,
    email,
    userId,
    tokenSource: "clerk",
  });
}
