module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: [
        "packages/*/src/**/*.ts",
        "packages/*/dist/*.cjs.js"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/test/jest-setup.js"
    ]
};
