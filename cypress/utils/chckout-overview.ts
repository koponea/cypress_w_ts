import * as gen from '../utils/general-utils'

/** locators */
export const subtotalLabel: string = gen.dataTest('subtotal-label')
export const taxLabel: string = gen.dataTest('tax-label')
export const totalLabel: string = gen.dataTest('total-label')
export const finishButton: string = gen.dataTest('finish')
export const orderItemList: string = gen.dataTest('cart-list')
export const orderItem: string = gen.dataTest('inventory-item')

/** functions */
const assertLabelAmount = (locator: string, expectedAmount: string): Cypress.Chainable =>
  cy.get(locator).invoke('text').then(gen.parseTrailingPrice).should('eq', Number(expectedAmount))

export const assertOrderTotals = ({ subtotal, tax, total }: gen.OrderTotals): void => {
  assertLabelAmount(subtotalLabel, subtotal)
  assertLabelAmount(taxLabel, tax)
  assertLabelAmount(totalLabel, total)
}

export const assertNoItemsInOrder = (): Cypress.Chainable =>
  cy.get(orderItemList).find(orderItem).should('not.exist')

export const finish = (): Cypress.Chainable => cy.get(finishButton).click()
