module.exports = {
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    testMatch: ["**/tests/**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
};
