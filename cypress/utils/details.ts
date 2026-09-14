import * as gen from '../utils/general-utils'

export class SauceDemoDetailsPage {
  /** locators */
  readonly itemName: string = gen.dataTest('inventory-item-name');
  readonly backToProductsButton: string = gen.dataTest('back-to-products');

  /** methods */
  getItemName(): Cypress.Chainable<string> {
    return cy.get(this.itemName).invoke('text');
  }

  backToProducts(): Cypress.Chainable {
    return cy.get(this.backToProductsButton).click();
  }
}
