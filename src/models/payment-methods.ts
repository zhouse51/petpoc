import { z } from "zod";

export const paymentMethodResponseSchema = z.object({
  id: z.string(),
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number().int(),
  expYear: z.number().int(),
});

export const paymentMethodsResponseSchema = z.object({
  paymentMethods: z.array(paymentMethodResponseSchema),
});

export const setupIntentResponseSchema = z.object({
  clientSecret: z.string(),
});

export type PaymentMethodResponse = z.infer<typeof paymentMethodResponseSchema>;
export type PaymentMethodsResponse = z.infer<typeof paymentMethodsResponseSchema>;
export type SetupIntentResponse = z.infer<typeof setupIntentResponseSchema>;
