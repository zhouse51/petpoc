import type { NextRequest } from "next/server";

import { handleEchoGet } from "@/services/echo/handler";

export async function GET(request: NextRequest) {
  return handleEchoGet(request);
}
