module.exports = {
    testEnvironment: "node",
    clearMocks: true,
    maxWorkers: 1, // avoids collision to test database
    moduleFileExtensions: ["ts", "js", "json", "node"],
    testMatch: ["**/tests/**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
};
