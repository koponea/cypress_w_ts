import * as gen from '../utils/general-utils'

/** locators */
export const completeHeader: string = gen.dataTest('complete-header')
export const generatePdfButton: string = gen.dataTest('generate-pdf-order')
export const backToProductsButton: string = gen.dataTest('back-to-products')

/** functions */
export const assertOrderComplete = (): Cypress.Chainable =>
  cy.get(completeHeader).should('have.text', 'Thank you for your order!')

export const generatePdfOrder = (): Cypress.Chainable => cy.get(generatePdfButton).click()

// Kuitin tiedostonimi sisältää tilaushetken aikaleiman (order.orderDate),
// joka syntyy juuri "Finish"-painikkeen klikkaushetkellä selaimessa.
// Kellon jäädyttäminen ennen sitä (cy.clock ennen finish()-kutsua) tekee
// lopullisesta tiedostonimestä ennustettavan, jotta kuitti-pdf:n kutsu
// voidaan varmentaa suoraan levylle ladatusta tiedostosta.
export const expectedReceiptFileName = (orderTimestamp: Date): string => {
  const isoTimestamp = orderTimestamp.toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19)
  return `swag-labs-order-${isoTimestamp}.pdf`
}

export const assertReceiptPdfDownloaded = (fileName: string): Cypress.Chainable =>
  cy.readFile(`cypress/downloads/${fileName}`, 'binary').should('match', /^%PDF-/)

export const backHome = (): Cypress.Chainable => cy.get(backToProductsButton).click()
