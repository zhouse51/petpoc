import { prisma } from "@/services/db/client";

export type PersistAppUserInput = {
  clerkUserId: string;
  email: string;
  name?: string | null;
};

export async function upsertAppUser(input: PersistAppUserInput) {
  return prisma.users.upsert({
    where: {
      auth_user_id: input.clerkUserId,
    },
    create: {
      auth_user_id: input.clerkUserId,
      name: input.name ?? input.email,
    },
    update: {
      name: input.name ?? input.email,
    },
  });
}

export async function getAppUserByClerkId(clerkUserId: string) {
  return prisma.users.findUnique({
    where: {
      auth_user_id: clerkUserId,
    },
  });
}
