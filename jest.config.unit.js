const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(test).js'],
};
