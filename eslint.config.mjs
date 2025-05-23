import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.config({
    extends: [
      "next/core-web-vitals", // Includes Next.js core rules, React, React Hooks, and basic ESLint rules
      "next/typescript",      // Adds TypeScript specific lint rules from @typescript-eslint/recommended
    ],
    rules: {
      // Preserve your existing rule overrides
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off", // Added based on conversation summary

      // Add any other global rule overrides here if needed
      // For example:
      // 'some-other-rule': 'warn',
    },
    // "eslint-config-next" (via "next/typescript") should correctly configure
    // the parser and parserOptions for TypeScript.
    // If specific overrides were needed, they would be more complex in flat config
    // and might involve a separate config object with languageOptions.
  }),

  // You can add other flat config objects here if needed, for example, to ignore files:
  // {
  //   ignores: ["dist/**", ".next/**"],
  // }
];
