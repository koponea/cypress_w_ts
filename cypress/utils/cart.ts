import * as gen from '../utils/general-utils'

/** locators */
export const cartList: string = gen.dataTest('cart-list');
export const cartItem: string = gen.dataTest('inventory-item');
export const cartItemName: string = gen.dataTest('inventory-item-name');
export const removeFromCartButton: string = gen.dataTestStartsWith('remove-');
export const continueShoppingButton: string = gen.dataTest('continue-shopping');
export const checkoutButton: string = gen.dataTest('checkout');

/** functions */
export const getItemNameAtIndex = (index: number): Cypress.Chainable<string> =>
  cy.get(cartItem).eq(index).find(cartItemName).invoke('text');

export const removeItemAtIndex = (index: number): Cypress.Chainable =>
  cy.get(cartItem).eq(index).find(removeFromCartButton).click();

export const assertCartIsEmpty = (): Cypress.Chainable =>
  cy.get(cartList).find(cartItem).should('not.exist');

export const assertCartItemCount = (count: number): Cypress.Chainable =>
  cy.get(cartItem).should('have.length', count);

export const continueShopping = (): Cypress.Chainable => cy.get(continueShoppingButton).click();

export const goToCheckout = (): Cypress.Chainable => cy.get(checkoutButton).click();
