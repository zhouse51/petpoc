const PASSWORD_PLACEHOLDERS = [
  "[YOUR-PASSWORD]",
  "${DATABASE_PWD}",
  "{DATABASE_PWD}",
];

type DatabaseEnv = Record<string, string | undefined>;

export const getDatabaseUrl = (env: DatabaseEnv = process.env): string => {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  const placeholder = PASSWORD_PLACEHOLDERS.find((value): boolean =>
    databaseUrl.includes(value),
  );

  if (!placeholder) {
    return databaseUrl;
  }

  if (!env.DATABASE_PWD) {
    throw new Error(
      `DATABASE_PWD is required when DATABASE_URL contains ${placeholder}.`,
    );
  }

  return databaseUrl.replace(placeholder, encodeURIComponent(env.DATABASE_PWD));
};
