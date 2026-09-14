import * as gen from '../utils/general-utils'

/** locators */
export const loginCredentialsGrid = `.login_credentials`;
export const loginPasswordGrid = `.login_password`;
export const loginButton: string = gen.dataTest('login-button');
export const passwordInput: string = gen.dataTest('password');
export const usernameInput: string = gen.dataTest('username');

/** functions */
export const loginAsDefaultUser = (): void => {
  cy.visit(gen.portalUrl)
  cy.get(usernameInput).type(gen.defaultUsername)
  gen.defaultPassword()
    .then(password => cy.get(passwordInput).type(password))
    .then(() => cy.get(loginButton).click())
  cy.contains(gen.portalHomeSecondaryHeader, { timeout: 20000 })
}
