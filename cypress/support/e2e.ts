// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// TypeScript will now recognize those properties inside cy.window() callbacks:
// cy.window().then((win) => {
//   win.env.DISABLE = true // no TypeScript error
// })

declare global {
  namespace Cypress {
    interface ApplicationWindow {
      // add the properties your app sets on window
      env: {
        DISABLE: boolean
      }
    }
  }
}
