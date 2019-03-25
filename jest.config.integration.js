const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  testMatch: ['**/__itests__/**/*.js', '**/?(*.)+(itest).js'],
  setupFiles: ['./tools/integration.setup.js'],
};
