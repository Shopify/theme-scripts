module.exports = {
  preset: 'jest-puppeteer',
  setupTestFrameworkScriptFile: 'expect-puppeteer',
  testPathIgnorePatterns: ['.eslintrc.js'],
  transform: {
    "^.+\\.js$": "babel-jest",
    '^.+\\.txt$': 'jest-raw-loader'
  }
};
