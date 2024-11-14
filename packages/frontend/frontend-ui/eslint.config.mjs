import vueConfing from "@heloir/eslint-config/vue.mjs";

export default [
  ...vueConfing,
  {
    rules: {
      "unicorn/filename-case": "off",
      "no-nested-ternary": "off",
      "prefer-named-capture-group": "off",
      "symbol-description": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
