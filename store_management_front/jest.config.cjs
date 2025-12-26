module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  extensionsToTreatAsEsm: [".jsx"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
