import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { registerUserRequestSchema } from "@/models/users";
import type { UserResponse } from "@/models/users";
import {
  getAppUserByClerkId,
  upsertAppUser,
} from "@/services/repositories/app-users";

const serializeUser = (
  user: Awaited<ReturnType<typeof getAppUserByClerkId>>,
): UserResponse | null => {
  if (!user) return null;

  return {
    id: user.id,
    auth_user_id: user.auth_user_id,
    name: user.name,
    stripe_customer_id: user.stripe_customer_id,
  };
};

const getAuthenticatedUserId = async (): Promise<string | null> => {
  const { isAuthenticated, userId } = await auth({
    acceptsToken: "session_token",
  });

  if (!isAuthenticated || !userId) {
    return null;
  }

  return userId;
};

export const handleRegisterUserPost = async (
  request: NextRequest,
): Promise<NextResponse> => {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch((): Record<string, never> => ({}));
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
};

export const handleGetUserByClerkId = async (
  _request: NextRequest,
  clerkUserId: string,
): Promise<NextResponse> => {
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
};
