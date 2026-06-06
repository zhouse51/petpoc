import type { NextRequest, NextResponse } from "next/server";

import { handleRegisterUserPost } from "@/services/users/handler";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  return handleRegisterUserPost(request);
};
