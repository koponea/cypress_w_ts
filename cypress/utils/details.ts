import * as gen from '../utils/general-utils'

/** locators */
export const itemName: string = gen.dataTest('inventory-item-name');
export const backToProductsButton: string = gen.dataTest('back-to-products');

/** functions */
export const getItemName = (): Cypress.Chainable<string> => cy.get(itemName).invoke('text');

export const backToProducts = (): Cypress.Chainable => cy.get(backToProductsButton).click();
