import { describe, expect, it } from "vitest";

import { echoRequestSchema, echoResponseSchema } from "@/models/echo";
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
      }).success,
    ).toBe(true);
  });
});
