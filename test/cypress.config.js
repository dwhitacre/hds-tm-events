const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: '{api,e2e}/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    baseUrl: 'http://localhost:4200'
  },
});
