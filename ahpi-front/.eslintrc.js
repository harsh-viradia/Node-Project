/* eslint-disable unicorn/prefer-module */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@babel/eslint-parser",
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "plugin:yml/standard",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
    "plugin:@next/next/recommended",
  ],
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  plugins: [
    "react",
    "html",
    "promise",
    "sonarjs",
    "unicorn",
    "write-good-comments",
    "jsx-a11y",
    "react-hooks",
    // "filenames",
    "simple-import-sort",
    // "import",
  ],
  rules: {
    "no-console": "warn",
    "write-good-comments/write-good-comments": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "unicorn/prefer-module": 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    // "filenames/match-regex": 2,
    // "filenames/match-exported": [2, "camel"],
    // "filenames/no-index": 2,
    // "unicorn/filename-case": [
    //   "error",
    //   {
    //     cases: {
    //       camelCase: true,
    //       pascalCase: true,
    //     },
    //   },
    // ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    // "import/no-unresolved": [2, { commonjs: true, amd: true, caseSensitiveStrict: true }],
    "import/named": 2,
    "import/namespace": 2,
    "import/default": 2,
    "import/export": 2,
    "prettier/prettier": "error",
    "linebreak-style": 0,
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "react/prop-types": 0,
    "@next/next/no-img-element": 0,
    "import/no-unresolved": 0,
    "no-extraneous-dependencies": 0,
    "react/jsx-props-no-spreading": 0,
    "unicorn/prevent-abbreviations": 0,
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "@next/next/no-html-link-for-pages": 0, // disabled for now but it should not be
    "unicorn/filename-case": 0, // disabled for now but it should not be
    "import/no-absolute-path": 0, // allowing abosolute path
  },
  // settings: {
  //   "import/resolver": {
  //     jsconfig: {
  //       config: "jsconfig.json",
  //       extensions: [".js", ".jsx"],
  //     },
  //   },
  //   "import/ignore": [".(scss|less|css)"],
  // },
  // settings: {
  //   "import/resolver": {
  //     jsconfig: {
  //       config: "./jsconfig.json",
  //     },
  //   },
  // },
}
