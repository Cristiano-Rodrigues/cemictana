export default {
  clearMocks: true,

  collectCoverageFrom: [
    '<rootDir>/**/*.test.js'
  ],

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  rootDir: './src',

  transform: {
    "^.+\\.js?$": "babel-jest"
  }
};
