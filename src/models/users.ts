import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.string(),
  auth_user_id: z.string(),
  name: z.string(),
});

export const registerUserRequestSchema = z.object({
  name: z.string().trim().min(1).optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
