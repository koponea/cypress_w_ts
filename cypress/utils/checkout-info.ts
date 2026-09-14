import * as gen from '../utils/general-utils'

export class SauceDemoCheckoutInfoPage {
  /** locators */
  readonly firstNameInput: string = gen.dataTest('firstName')
  readonly lastNameInput: string = gen.dataTest('lastName')
  readonly postalCodeInput: string = gen.dataTest('postalCode')
  readonly continueButton: string = gen.dataTest('continue')

  /** methods */
  fillBuyerInfo(firstName: string, lastName: string, postalCode: string): void {
    cy.get(this.firstNameInput).type(firstName)
    cy.get(this.lastNameInput).type(lastName)
    cy.get(this.postalCodeInput).type(postalCode)
  }

  assertBuyerInfo(firstName: string, lastName: string, postalCode: string): void {
    cy.get(this.firstNameInput).should('have.value', firstName)
    cy.get(this.lastNameInput).should('have.value', lastName)
    cy.get(this.postalCodeInput).should('have.value', postalCode)
  }

  continueToOverview(): Cypress.Chainable {
    return cy.get(this.continueButton).click()
  }
}
