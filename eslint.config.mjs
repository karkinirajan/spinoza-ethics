import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Next.js and React best practices
      "react/no-unescaped-entities": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      // TypeScript best practices
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // (This rule was misnamed before, so it never ran. Callbacks and typed function expressions are exempt: React components are
      // typed by FC and inline handlers by their props.)
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true },
      ],

      // Code quality
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    files: ["src/context/ThemeContext.tsx"],
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    // Test helpers are small arrow functions whose types are inferred.
    files: ["test/**/*.ts"],
    rules: { "@typescript-eslint/explicit-function-return-type": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local, git-ignored notes from an editor tool; not project source.
    ".remember/**",
    "node_modules/**",
    ".git/**",
    "dist/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
