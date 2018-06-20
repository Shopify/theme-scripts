module.exports = function(wallaby) {
  return {
    files: [
      'packages/theme-cart/theme-cart.js',
      'packages/theme-cart/request.js',
      'packages/theme-cart/validate.js',
      '**/__fixtures__/**/*'
    ],

    tests: ['packages/theme-cart/**/*.test.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest',

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};
