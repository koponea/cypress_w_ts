import * as gen from '../utils/general-utils'

/** locators */
export const firstNameInput: string = gen.dataTest('firstName')
export const lastNameInput: string = gen.dataTest('lastName')
export const postalCodeInput: string = gen.dataTest('postalCode')
export const continueButton: string = gen.dataTest('continue')

/** functions */
export const fillBuyerInfo = (firstName: string, lastName: string, postalCode: string): void => {
  cy.get(firstNameInput).type(firstName)
  cy.get(lastNameInput).type(lastName)
  cy.get(postalCodeInput).type(postalCode)
}

export const assertBuyerInfo = (firstName: string, lastName: string, postalCode: string): void => {
  cy.get(firstNameInput).should('have.value', firstName)
  cy.get(lastNameInput).should('have.value', lastName)
  cy.get(postalCodeInput).should('have.value', postalCode)
}

export const continueToOverview = (): Cypress.Chainable => cy.get(continueButton).click()
