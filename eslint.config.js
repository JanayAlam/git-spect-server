import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    ignores: ["node_modules", "dist", ".env", ".env.dev", ".env.prod"],

    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      import: eslintPluginImport,
      "@typescript-eslint": typescriptPlugin,
      prettier: eslintPluginPrettier,
    },

    rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          ts: "never",
          mjs: "never",
        },
      ],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "no-console": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
