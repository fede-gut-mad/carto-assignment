// eslint.config.mjs
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
  // 1) What to ignore (replaces .eslintignore)
  {
    ignores: [
      "node_modules",
      "playwright-report*",
      "test-results",
      "dist",
      "coverage",
      ".github",
    ],
  },

  // 2) TypeScript recommended rules (parser included)
  ...tseslint.configs.recommended,

  // 3) Playwright rules for tests/
  {
    files: ["tests/**/*.{ts,tsx}"],
    plugins: { playwright },
    rules: {
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      // optional extras:
      // 'playwright/prefer-locators': 'warn',
      // 'playwright/expect-expect': 'off',
    },
  }
);
