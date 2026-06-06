import type { NextRequest, NextResponse } from "next/server";

import { handleGetUserByClerkId } from "@/services/users/handler";

type RouteContext = {
  params: Promise<{
    clerkUserId: string;
  }>;
};

export const GET = async (
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> => {
  const { clerkUserId } = await context.params;

  return handleGetUserByClerkId(request, clerkUserId);
};
