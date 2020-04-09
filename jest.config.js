module.exports = {
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.json",
      "diagnostics": {
        "pathRegex": "\\.(spec|test)\\.ts$"
      }
    }
  },
  "testMatch": [
    "**/test/*.+(ts|js)"
  ]
}
