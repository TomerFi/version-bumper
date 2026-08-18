import globals from "globals"
import js from "@eslint/js"

export default [
  {
    name: "default",
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.nodeBuiltin,
        ...globals.mocha
      }
    },
    rules: {
      ...js.configs.recommended.rules,
    }
  },
]
