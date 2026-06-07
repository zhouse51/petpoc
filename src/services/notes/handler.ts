import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { createNoteRequestSchema } from "@/models/notes";
import type { NoteResponse, NotesResponse } from "@/models/notes";
import { getAppUserByClerkId } from "@/services/repositories/app-users";
import {
  createNote,
  listNotesByUserId,
} from "@/services/repositories/notes";

const getAuthenticatedUserId = async (): Promise<string | null> => {
  const { isAuthenticated, userId } = await auth({
    acceptsToken: "session_token",
  });

  if (!isAuthenticated || !userId) {
    return null;
  }

  return userId;
};

const serializeNote = (
  note: Awaited<ReturnType<typeof createNote>>,
): NoteResponse => {
  return {
    id: note.id,
    userId: note.user_id,
    message: note.note,
  };
};

const getAuthenticatedAppUser = async (): Promise<
  Awaited<ReturnType<typeof getAppUserByClerkId>> | null
> => {
  const clerkUserId = await getAuthenticatedUserId();

  if (!clerkUserId) {
    return null;
  }

  return getAppUserByClerkId(clerkUserId);
};

export const handleNotesGet = async (): Promise<NextResponse> => {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await listNotesByUserId(user.id);
  const response: NotesResponse = {
    notes: notes.map(serializeNote),
  };

  return NextResponse.json(response);
};

export const handleNotesPost = async (
  request: NextRequest,
): Promise<NextResponse> => {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch((): Record<string, never> => ({}));
  const parsedBody = createNoteRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid note body",
        details: parsedBody.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const note = await createNote({
    message: parsedBody.data.message,
    userId: user.id,
  });

  return NextResponse.json(serializeNote(note), { status: 201 });
};
