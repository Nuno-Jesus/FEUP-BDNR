import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import _import from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactRefresh from "eslint-plugin-react-refresh";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        "./src/components/ui/**",
        "./src/components/theme/**",
        "./src/components/imported/**",
        "./src/hooks/use-mobile.ts",
        "./src/lib/**",
    ]),
    {
        extends: compat.extends(
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended",
        ),

        plugins: {
            react,
            import: fixupPluginRules(_import),
            "react-hooks": fixupPluginRules(reactHooks),
            "@typescript-eslint": typescriptEslint,
            "react-refresh": reactRefresh,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                jsdom: true,
                shallow: true,
                render: true,
                rtlRender: true,
                mount: true,
                fetchMock: true,
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "commonjs",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "react-refresh/only-export-components": "warn",
            "no-misleading-character-class": "error",
            "no-template-curly-in-string": "error",
            "no-console": "warn",
            "linebreak-style": "off",

            "no-restricted-syntax": ["error", {
                selector: "TSEnumDeclaration",
                message: "Don't declare enums",
            }],

            "import/first": "error",
            "array-callback-return": "error",
            "consistent-return": "error",
            "default-case": "error",
            "no-eq-null": "error",
            "no-param-reassign": "error",
            "no-return-assign": "error",
            "no-return-await": "error",
            "require-await": "error",
            radix: "error",
            "no-unused-vars": "off",

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            }],

            "no-shadow-restricted-names": "error",
            "array-bracket-spacing": "error",
            "block-spacing": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],

            "comma-spacing": ["error", {
                before: false,
                after: true,
            }],

            "comma-style": ["error", "last"],
            "computed-property-spacing": ["error", "never"],
            "eol-last": ["error", "always"],

            "jsx-quotes": ["error", "prefer-double"],

            "key-spacing": ["error", {
                beforeColon: false,
                afterColon: true,
            }],

            "keyword-spacing": "error",

            "max-len": ["error", {
                code: 140,
            }],

            "new-parens": "error",
            "no-mixed-operators": "error",

            "no-multiple-empty-lines": ["error", {
                max: 2,
                maxEOF: 0,
            }],

            "no-nested-ternary": "error",
            "no-trailing-spaces": "error",
            "no-tabs": "off",
            "object-curly-spacing": ["error", "always"],
            "prefer-object-spread": "error",

            quotes: ["error", "single", {
                avoidEscape: true,
            }],

            semi: ["error", "always", {
                omitLastInOneLineBlock: true,
            }],

            "semi-spacing": ["error", {
                before: false,
                after: true,
            }],

            "space-before-blocks": ["error", "always"],

            "space-before-function-paren": ["error", {
                anonymous: "never",
                named: "never",
                asyncArrow: "always",
            }],

            "space-in-parens": "error",
            "space-infix-ops": "error",

            "space-unary-ops": ["error", {
                words: true,
                nonwords: false,
            }],

            "spaced-comment": ["error", "always", {
                exceptions: ["-"],
            }],

            "switch-colon-spacing": ["error", {
                after: true,
                before: false,
            }],

            "brace-style": ["error", "1tbs"],
            camelcase: "error",
            "arrow-spacing": "error",
            "arrow-body-style": ["error", "as-needed"],
            "arrow-parens": ["error", "always"],
            "no-duplicate-imports": "error",
            "no-var": "error",

            "prefer-const": ["error", {
                destructuring: "all",
            }],

            "prefer-template": "error",
            "template-curly-spacing": "error",
            "react/prop-types": "warn",
            "react/no-unescaped-entities": "error",
            "react/no-children-prop": "error",
            "react/no-deprecated": "error",
            "react/no-direct-mutation-state": "error",
            "react/no-unknown-property": "error",
            "react/require-render-return": "error",
            "react/no-unused-prop-types": "error",
            "react/no-unused-state": "error",
            "react/self-closing-comp": "error",
            "react/void-dom-elements-no-children": "error",
            "react/jsx-closing-tag-location": "error",
            "react/jsx-closing-bracket-location": "error",
            "react/jsx-equals-spacing": "error",
            "react/jsx-indent": "off",
            "react/jsx-indent-props": "off",

            "react/jsx-one-expression-per-line": ["error", {
                allow: "literal",
            }],

            "react/jsx-first-prop-new-line": ["error", "multiline"],
            "react/jsx-no-comment-textnodes": "error",
            "react/jsx-no-duplicate-props": "error",
            "react/jsx-no-target-blank": "error",
            "react/jsx-no-undef": "error",
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/jsx-pascal-case": "error",

            "react/jsx-tag-spacing": ["error", {
                beforeClosing: "never",
            }],

            "react/react-in-jsx-scope": "off",

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    }
]);