import * as gen from '../utils/general-utils'

export class SauceDemoCheckoutCompletePage {
  /** locators */
  readonly completeHeader: string = gen.dataTest('complete-header')
  readonly generatePdfButton: string = gen.dataTest('generate-pdf-order')
  readonly backToProductsButton: string = gen.dataTest('back-to-products')

  /** methods */
  assertOrderComplete(): Cypress.Chainable {
    return cy.get(this.completeHeader).should('have.text', 'Thank you for your order!')
  }

  generatePdfOrder(): Cypress.Chainable {
    return cy.get(this.generatePdfButton).click()
  }

  // Kuitin tiedostonimi sisältää tilaushetken aikaleiman (order.orderDate),
  // joka syntyy juuri "Finish"-painikkeen klikkaushetkellä selaimessa.
  // Kellon jäädyttäminen ennen sitä (cy.clock ennen finish()-kutsua) tekee
  // lopullisesta tiedostonimestä ennustettavan, jotta kuitti-pdf:n kutsu
  // voidaan varmentaa suoraan levylle ladatusta tiedostosta.
  expectedReceiptFileName(orderTimestamp: Date): string {
    const isoTimestamp = orderTimestamp.toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, 19)
    return `swag-labs-order-${isoTimestamp}.pdf`
  }

  assertReceiptPdfDownloaded(fileName: string): Cypress.Chainable {
    return cy.readFile(`cypress/downloads/${fileName}`, 'binary').should('match', /^%PDF-/)
  }

  backHome(): Cypress.Chainable {
    return cy.get(this.backToProductsButton).click()
  }
}
