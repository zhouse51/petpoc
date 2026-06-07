import { z } from "zod";

export const createNoteRequestSchema = z.object({
  message: z.string().trim().min(1).max(2_000),
});

export const noteResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string(),
});

export const notesResponseSchema = z.object({
  notes: z.array(noteResponseSchema),
});

export type CreateNoteRequest = z.infer<typeof createNoteRequestSchema>;
export type NoteResponse = z.infer<typeof noteResponseSchema>;
export type NotesResponse = z.infer<typeof notesResponseSchema>;
