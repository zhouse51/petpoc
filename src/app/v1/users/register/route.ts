import type { NextRequest } from "next/server";

import { handleRegisterUserPost } from "@/services/users/handler";

export async function POST(request: NextRequest) {
  return handleRegisterUserPost(request);
}
