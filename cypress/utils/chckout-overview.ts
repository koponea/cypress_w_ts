import * as gen from '../utils/general-utils'

export class SauceDemoCheckoutOverviewPage {
  /** locators */
  readonly subtotalLabel: string = gen.dataTest('subtotal-label')
  readonly taxLabel: string = gen.dataTest('tax-label')
  readonly totalLabel: string = gen.dataTest('total-label')
  readonly finishButton: string = gen.dataTest('finish')
  readonly orderItemList: string = gen.dataTest('cart-list')
  readonly orderItem: string = gen.dataTest('inventory-item')

  /** methods */
  private assertLabelAmount(locator: string, expectedAmount: string): Cypress.Chainable {
    return cy.get(locator).invoke('text').then(gen.parseTrailingPrice).should('eq', Number(expectedAmount))
  }

  assertOrderTotals({ subtotal, tax, total }: gen.OrderTotals): void {
    this.assertLabelAmount(this.subtotalLabel, subtotal)
    this.assertLabelAmount(this.taxLabel, tax)
    this.assertLabelAmount(this.totalLabel, total)
  }

  assertNoItemsInOrder(): Cypress.Chainable {
    return cy.get(this.orderItemList).find(this.orderItem).should('not.exist')
  }

  finish(): Cypress.Chainable {
    return cy.get(this.finishButton).click()
  }
}
