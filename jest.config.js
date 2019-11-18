module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: ["packages/*/src/**/*.ts"],
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.js"],
    snapshotSerializers: ["jest-snapshot-serializer-ansi"]
};
