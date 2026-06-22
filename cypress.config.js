const { defineConfig } = require('cypress');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const createBundler = require('@bahmutov/cypress-esbuild-bundler');

module.exports = defineConfig({
  e2e: {
    specPattern: 'features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 60000,
    screenshotsFolder: 'test-results/screenshots',
    videosFolder: 'test-results/videos',
    video: false,
    screenshotOnRunFailure: true,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
  },
});
