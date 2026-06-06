import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "node_modules/**",
      "yarn.lock",
    ],
  },
  {
    files: ["src/app/**/*.{ts,tsx}"],
    ignores: ["src/app/api/**/*", "src/app/**/route.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@prisma/client",
              message: "Database access must stay in API handlers or src/services.",
            },
          ],
          patterns: [
            {
              group: ["@/services/db/*"],
              message: "Database access must stay in API handlers or src/services.",
            },
          ],
        },
      ],
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
