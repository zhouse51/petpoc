import { describe, expect, it } from "vitest";

import { echoRequestSchema, echoResponseSchema } from "@/models/echo";
import {
  paymentMethodResponseSchema,
  paymentMethodsResponseSchema,
  setupIntentResponseSchema,
} from "@/models/payment-methods";
import {
  createNoteRequestSchema,
  noteResponseSchema,
  notesResponseSchema,
} from "@/models/notes";
import {
  registerUserRequestSchema,
  userResponseSchema,
} from "@/models/users";

describe("echo schemas", (): void => {
  it("accepts a valid optional echo query", (): void => {
    const result = echoRequestSchema.safeParse({
      name: " James Zhou ",
      email: "james@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.success ? result.data : null).toEqual({
      name: "James Zhou",
      email: "james@example.com",
    });
  });

  it("rejects invalid echo email values", (): void => {
    expect(
      echoRequestSchema.safeParse({
        email: "not-an-email",
      }).success,
    ).toBe(false);
  });

  it("accepts the Clerk echo response shape", (): void => {
    expect(
      echoResponseSchema.safeParse({
        name: "James Zhou",
        email: "james@example.com",
        userId: "user_abc123",
        tokenSource: "clerk",
      }).success,
    ).toBe(true);
  });
});

describe("user schemas", (): void => {
  it("accepts an empty register body", (): void => {
    expect(registerUserRequestSchema.safeParse({}).success).toBe(true);
  });

  it("trims a provided register name", (): void => {
    const result = registerUserRequestSchema.safeParse({
      name: " James Zhou ",
    });

    expect(result.success).toBe(true);
    expect(result.success ? result.data.name : null).toBe("James Zhou");
  });

  it("rejects an empty register name", (): void => {
    expect(registerUserRequestSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("accepts a user response from the users table", (): void => {
    expect(
      userResponseSchema.safeParse({
        id: "7dc4e84a-9abc-4f01-bf61-669b747fb1b8",
        auth_user_id: "user_abc123",
        name: "James Zhou",
        stripe_customer_id: "cus_123",
      }).success,
    ).toBe(true);
  });
});

describe("payment method schemas", (): void => {
  it("accepts setup intent response shapes", (): void => {
    expect(
      setupIntentResponseSchema.safeParse({
        clientSecret: "seti_123_secret_abc",
      }).success,
    ).toBe(true);
  });

  it("accepts payment method response shapes", (): void => {
    const paymentMethod = {
      id: "pm_123",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2030,
    };

    expect(paymentMethodResponseSchema.safeParse(paymentMethod).success).toBe(true);
    expect(
      paymentMethodsResponseSchema.safeParse({
        paymentMethods: [paymentMethod],
      }).success,
    ).toBe(true);
  });
});

describe("note schemas", (): void => {
  it("trims a note message", (): void => {
    const result = createNoteRequestSchema.safeParse({
      message: " Remember favorite food ",
    });

    expect(result.success).toBe(true);
    expect(result.success ? result.data.message : null).toBe("Remember favorite food");
  });

  it("rejects an empty note message", (): void => {
    expect(createNoteRequestSchema.safeParse({ message: "" }).success).toBe(false);
  });

  it("accepts note response shapes", (): void => {
    const note = {
      id: "89ccfdb7-c1ea-4e31-a2cf-b7018fab31ad",
      userId: "7dc4e84a-9abc-4f01-bf61-669b747fb1b8",
      message: "Remember favorite food",
    };

    expect(noteResponseSchema.safeParse(note).success).toBe(true);
    expect(notesResponseSchema.safeParse({ notes: [note] }).success).toBe(true);
  });
});
