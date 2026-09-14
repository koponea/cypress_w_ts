import * as gen from '../utils/general-utils'

export class SauceDemoCartPage {
  /** locators */
  readonly cartList: string = gen.dataTest('cart-list');
  readonly cartItem: string = gen.dataTest('inventory-item');
  readonly cartItemName: string = gen.dataTest('inventory-item-name');
  readonly removeFromCartButton: string = gen.dataTestStartsWith('remove-');
  readonly continueShoppingButton: string = gen.dataTest('continue-shopping');
  readonly checkoutButton: string = gen.dataTest('checkout');

  /** methods */
  getItemNameAtIndex(index: number): Cypress.Chainable<string> {
    return cy.get(this.cartItem).eq(index).find(this.cartItemName).invoke('text');
  }

  removeItemAtIndex(index: number): Cypress.Chainable {
    return cy.get(this.cartItem).eq(index).find(this.removeFromCartButton).click();
  }

  assertCartIsEmpty(): Cypress.Chainable {
    return cy.get(this.cartList).find(this.cartItem).should('not.exist');
  }

  assertCartItemCount(count: number): Cypress.Chainable {
    return cy.get(this.cartItem).should('have.length', count);
  }

  continueShopping(): Cypress.Chainable {
    return cy.get(this.continueShoppingButton).click();
  }

  goToCheckout(): Cypress.Chainable {
    return cy.get(this.checkoutButton).click();
  }
}
