import type { notes } from "@prisma/client";

import { prisma } from "@/services/repositories/client";

export type CreateNoteInput = {
  userId: string;
  message: string;
};

export const createNote = async (input: CreateNoteInput): Promise<notes> => {
  return prisma.notes.create({
    data: {
      note: input.message,
      user_id: input.userId,
    },
  });
};

export const listNotesByUserId = async (userId: string): Promise<notes[]> => {
  return prisma.notes.findMany({
    where: {
      user_id: userId,
    },
  });
};
