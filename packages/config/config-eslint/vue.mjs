import pluginVue from "eslint-plugin-vue";
import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueTsEslintConfig from "@vue/eslint-config-typescript";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  {
    rules: {
      "import/no-default-export": "off",
      "vue/multi-word-component-names": "off",
      // add specific rules configurations here
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "unicorn/filename-case": "off",
    },
  },
  {
    ignores: ["node_modules", "dist", "public"],
  },
];
