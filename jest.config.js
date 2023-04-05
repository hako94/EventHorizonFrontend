module.exports = {
  testRunner: 'jest-jasmine2',
  preset: 'jest-preset-angular',
  testMatch: [
    "**/*.spec.ts",
    "**/*.steps.ts"
  ],
  collectCoverage: true,
  "reporters": [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Latest Test Report",
      "outputPath": "./tmp/report/index.html",
      "includeCoverage": true
    }]
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true
};
