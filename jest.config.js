module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: [
        "packages/**"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/test/jest-setup.js"
    ]
};
