module.exports = {
  root: true,
  extends: ["plugin:vue/vue3-essential", "@heloir/eslint-config/vue.js"],
  rules: {
    "unicorn/filename-case": "off",
    "no-nested-ternary": "off",
    "prefer-named-capture-group": "off",
    "symbol-description": "off",
  },
};
