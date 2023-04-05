module.exports = {
  testRunner: 'jest-jasmine2',
  preset: 'jest-preset-angular',
  testMatch: [
    "**/*.spec.ts",
    "**/*.steps.ts"
  ],
  collectCoverage: true,
  "reporters": [ "default", ["./node_modules/jest-html-reporter", { outputPath: "./tmp/report/index.html",
      "pageTitle": "Latest Test Report"
    }]
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true
};
