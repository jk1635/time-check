module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "airbnb/hooks",
        "airbnb-typescript",
        "prettier",
        "plugin:prettier/recommended",
        "plugin:import/typescript",
        "plugin:import/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        createDefaultProgram: true,
    },
    plugins: ["prettier", "react", "@typescript-eslint", "react-hooks"],
    settings: {
        "import/resolver": {
            node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        },
        "import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
    },
    rules: {
        // 일반 규칙
        "no-use-before-define": "off", // 변수가 정의되기 전에 사용을 허용 여부

        // 리액트 규칙
        "react/button-has-type": "off",
        "react/function-component-definition": ["error", { namedComponents: "arrow-function" }],
        "react/require-default-props": "off",

        // 리액트 훅스 규칙
        "react-hooks/exhaustive-deps": ["warn"], // hook 에서 의존성 배열 허용 여부

        // jsx 규칙 (웹 접근성)
        "jsx-a11y/label-has-for": ["error", { required: { every: ["id"] } }],
        "jsx-a11y/label-has-associated-control": [
            "error",
            {
                labelComponents: ["label"],
                labelAttributes: ["htmlFor"],
                controlComponents: ["input"],
            },
        ],

        // 타입스크립트 규칙
        "@typescript-eslint/no-use-before-define": [
            "off",
            {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        ],

        // 임포트 규칙
        "import/no-extraneous-dependencies": "off",
        "import/extensions": [
            "warn",
            "ignorePackages",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],
        "import/newline-after-import": "warn",
        "import/no-unresolved": "off",
        "import/order": [
            "error",
            {
                groups: ["builtin", "external", "internal", "type"],
                pathGroups: [
                    {
                        pattern: "{react,react-dom}",
                        group: "builtin",
                        position: "before",
                    },
                ],
                "newlines-between": "always", // 그룹 간에 최소 한줄이상의 줄바꿈이 강제화, 그룹안에서의 줄바꿈은 금지
                alphabetize: {
                    // 그룹 내 알파벳 기준으로 정렬
                    order: "asc", // 오름차순
                    caseInsensitive: true, // 대소문자 무시
                },
                pathGroupsExcludedImportTypes: ["builtin"], // pathGroups 에서 설정에 의해 처리되지 않는 import type 을 정의
            },
        ],
    },
};
