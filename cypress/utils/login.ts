import * as gen from '../utils/general-utils'

export class SauceDemoLoginPage {
  /** locators */
  readonly loginCredentialsGrid = `.login_credentials`;
  readonly loginPasswordGrid = `.login_password`;
  readonly loginButton: string = gen.dataTest('login-button');
  readonly passwordInput: string = gen.dataTest('password');
  readonly usernameInput: string = gen.dataTest('username');

  /** methods */
  loginAsDefaultUser(): void {
    cy.visit(gen.portalUrl)
    cy.get(this.usernameInput).type(gen.defaultUsername)
    gen.defaultPassword()
      .then(password => cy.get(this.passwordInput).type(password))
      .then(() => cy.get(this.loginButton).click())
    cy.contains(gen.portalHomeSecondaryHeader, { timeout: 20000 })
  }
}
