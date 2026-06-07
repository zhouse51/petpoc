import { describe, expect, it } from "vitest";

import { getDatabaseUrl } from "@/services/repositories/database-url";

describe("getDatabaseUrl", (): void => {
  it("returns DATABASE_URL unchanged when it has no password placeholder", (): void => {
    const databaseUrl = "postgresql://user:password@localhost:5432/app";

    expect(getDatabaseUrl({ DATABASE_URL: databaseUrl })).toBe(databaseUrl);
  });

  it("replaces the [YOUR-PASSWORD] placeholder with the URL-encoded password", (): void => {
    expect(
      getDatabaseUrl({
        DATABASE_URL:
          "postgresql://user:[YOUR-PASSWORD]@localhost:5432/app?pgbouncer=true",
        DATABASE_PWD: "pa:ss@word#1",
      }),
    ).toBe(
      "postgresql://user:pa%3Ass%40word%231@localhost:5432/app?pgbouncer=true",
    );
  });

  it("replaces the ${DATABASE_PWD} placeholder", (): void => {
    expect(
      getDatabaseUrl({
        DATABASE_URL: "postgresql://user:${DATABASE_PWD}@localhost:5432/app",
        DATABASE_PWD: "abc123",
      }),
    ).toBe("postgresql://user:abc123@localhost:5432/app");
  });

  it("throws when DATABASE_URL is missing", (): void => {
    expect((): string => getDatabaseUrl({})).toThrow(
      "DATABASE_URL is required to initialize Prisma.",
    );
  });

  it("throws when a password placeholder is present without DATABASE_PWD", (): void => {
    expect((): string =>
      getDatabaseUrl({
        DATABASE_URL: "postgresql://user:[YOUR-PASSWORD]@localhost:5432/app",
      }),
    ).toThrow(
      "DATABASE_PWD is required when DATABASE_URL contains [YOUR-PASSWORD].",
    );
  });
});
