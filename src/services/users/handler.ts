import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { registerUserRequestSchema } from "@/models/users";
import {
  getAppUserByClerkId,
  upsertAppUser,
} from "@/services/repositories/app-users";

function serializeUser(user: Awaited<ReturnType<typeof getAppUserByClerkId>>) {
  if (!user) return null;

  return {
    id: user.id,
    auth_user_id: user.auth_user_id,
    name: user.name,
  };
}

async function getAuthenticatedUserId() {
  const { isAuthenticated, userId } = await auth({
    acceptsToken: "session_token",
  });

  if (!isAuthenticated || !userId) {
    return null;
  }

  return userId;
}

export async function handleRegisterUserPost(request: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsedBody = registerUserRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid register user body",
        details: parsedBody.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const clerkUser = await currentUser();
  const fallbackName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    "Signed-in user";
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses.at(0)?.emailAddress;

  const user = await upsertAppUser({
    clerkUserId: userId,
    email,
    name: parsedBody.data.name || fallbackName,
  });

  return NextResponse.json(serializeUser(user), { status: 201 });
}

export async function handleGetUserByClerkId(
  _request: NextRequest,
  clerkUserId: string,
) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (userId !== clerkUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await getAppUserByClerkId(clerkUserId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(serializeUser(user));
}
