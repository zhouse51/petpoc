import { z } from "zod";

export const echoRequestSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
});

export const echoResponseSchema = z.object({
  name: z.string(),
  email: z.string().email().or(z.literal("unknown@example.invalid")),
  userId: z.string(),
  tokenSource: z.literal("clerk"),
});

export type EchoResponse = z.infer<typeof echoResponseSchema>;
