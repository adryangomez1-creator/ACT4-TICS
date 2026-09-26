import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/"],
  },
  js.configs.recommended,
  {
    files: ["script.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
        Intl: "readonly",
      },
    },
  },
];