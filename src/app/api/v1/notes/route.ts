import type { NextRequest, NextResponse } from "next/server";

import {
  handleNotesGet,
  handleNotesPost,
} from "@/services/notes/handler";

export const GET = async (): Promise<NextResponse> => {
  return handleNotesGet();
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  return handleNotesPost(request);
};
