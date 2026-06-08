import type { users } from "@prisma/client";

import { prisma } from "@/services/repositories/client";

export type PersistAppUserInput = {
  clerkUserId: string;
  email?: string | null;
  name?: string | null;
};

const getDisplayName = (input: PersistAppUserInput): string => {
  return input.name || input.email || "Signed-in user";
};

export const upsertAppUser = async (
  input: PersistAppUserInput,
): Promise<users> => {
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
};

export const getAppUserByClerkId = async (
  clerkUserId: string,
): Promise<users | null> => {
  return prisma.users.findUnique({
    where: {
      auth_user_id: clerkUserId,
    },
  });
};

export const updateAppUserStripeCustomerId = async (
  userId: string,
  stripeCustomerId: string,
): Promise<users> => {
  return prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      stripe_customer_id: stripeCustomerId,
    },
  });
};
