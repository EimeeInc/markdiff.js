module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "sort-imports-es6-autofix",
    "react",
    "jest",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    "comma-dangle": ["error", "only-multiline"],
    "eol-last": ["error", "always"],
    "no-constant-condition": ["error", { "checkLoops": false }],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "semi": ["error", "never"],
    "sort-imports-es6-autofix/sort-imports-es6": [2, {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    }],
    "space-infix-ops": "error",
    "react/display-name": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": ["error", { "functions": false }],
    "@typescript-eslint/no-var-requires": "off",
  },
}
