module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@@/(.*)$": "<rootDir>/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.cache/"],
}
