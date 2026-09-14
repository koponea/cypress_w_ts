import { defineConfig } from 'cypress'

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    usernames_default: 'standard_user locked_out_user problem_user performance_glitch_user error_user visual_user',
    password_default: 'secret_sauce',
  },
  expose: {
    demoPortalUrl: 'https://www.saucedemo.com/',
    usernameDefault: 'standard_user', // not so secret as username in front lage
  },
});
