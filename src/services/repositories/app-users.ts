import { prisma } from "@/services/repositories/client";

export type PersistAppUserInput = {
  clerkUserId: string;
  email?: string | null;
  name?: string | null;
};

function getDisplayName(input: PersistAppUserInput) {
  return input.name || input.email || "Signed-in user";
}

export async function upsertAppUser(input: PersistAppUserInput) {
  return prisma.users.upsert({
    where: {
      auth_user_id: input.clerkUserId,
    },
    create: {
      auth_user_id: input.clerkUserId,
      name: getDisplayName(input),
    },
    update: {
      name: getDisplayName(input),
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
