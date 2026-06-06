import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

import { getDatabaseUrl } from "./src/services/repositories/database-url";

loadEnv({ path: ".env.local" });

const prismaCliDatabaseUrl = process.env.DATABASE_DIRECT_URL
  ? getDatabaseUrl({
      DATABASE_URL: process.env.DATABASE_DIRECT_URL,
      DATABASE_PWD: process.env.DATABASE_PWD,
    })
  : getDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: prismaCliDatabaseUrl,
  },
});
