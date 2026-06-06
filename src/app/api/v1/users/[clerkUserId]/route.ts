import type { NextRequest } from "next/server";

import { handleGetUserByClerkId } from "@/services/users/handler";

type RouteContext = {
  params: Promise<{
    clerkUserId: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { clerkUserId } = await context.params;

  return handleGetUserByClerkId(request, clerkUserId);
}
