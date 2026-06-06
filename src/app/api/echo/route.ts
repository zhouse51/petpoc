import type { NextRequest, NextResponse } from "next/server";

import { handleEchoGet } from "@/services/echo/handler";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  return handleEchoGet(request);
};
