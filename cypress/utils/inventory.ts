import * as gen from '../utils/general-utils'

/** locators */
export const inventoryItem: string = gen.dataTest('inventory-item');
export const inventoryItemName: string = gen.dataTest('inventory-item-name');
export const inventoryItemPrice: string = gen.dataTest('inventory-item-price');
export const addToCartButton: string = gen.dataTestStartsWith('add-to-cart-');
export const removeFromCartButton: string = gen.dataTestStartsWith('remove-');
export const shoppingCartLink: string = gen.dataTest('shopping-cart-link');
export const shoppingCartBadge: string = gen.dataTest('shopping-cart-badge');
// react-burger-menu-kirjaston lisäämä todellinen klikattava nappi, ei omaa data-test-attribuuttia
// (data-test="open-menu" on vain kuvake, jonka nappi peittää eikä ole sen esi-isä)
export const openMenuButton = '#react-burger-menu-btn';
// Sama react-burger-menu-kirjaston rajoitus kuin openMenuButtonilla: oikea
// klikattava sulkunappi ei kanna data-test-attribuuttia, vain sen sisällä
// oleva kuvake (data-test="close-menu").
export const closeMenuButton = '.bm-cross-button';
export const logoutSidebarLink: string = gen.dataTest('logout-sidebar-link');
export const aboutSidebarLink: string = gen.dataTest('about-sidebar-link');

/** functions */
export const addItemToCartAtIndex = (index: number): Cypress.Chainable =>
  cy.get(inventoryItem).eq(index).find(addToCartButton).click();

export const removeItemFromCartAtIndex = (index: number): Cypress.Chainable =>
  cy.get(inventoryItem).eq(index).find(removeFromCartButton).click();

export const openItemDetailsAtIndex = (index: number): Cypress.Chainable =>
  cy.get(inventoryItemName).eq(index).click();

export const getItemNameAtIndex = (index: number): Cypress.Chainable<string> =>
  cy.get(inventoryItem).eq(index).find(inventoryItemName).invoke('text');

export const getItemPriceAtIndex = (index: number): Cypress.Chainable<number> =>
  cy.get(inventoryItem).eq(index).find(inventoryItemPrice).invoke('text').then(gen.parsePrice);

export const assertCartBadgeCount = (count: number): Cypress.Chainable =>
  cy.get(shoppingCartBadge).should('have.text', String(count));

export const assertCartBadgeAbsent = (): Cypress.Chainable =>
  cy.get(shoppingCartBadge).should('not.exist');

export const goToCart = (): Cypress.Chainable => cy.get(shoppingCartLink).click();

const isSidebarMenuOpen = (): Cypress.Chainable<boolean> =>
  cy.get('.bm-menu-wrap').then($wrap => !getComputedStyle($wrap[0]).transform.includes('-300'));

// Electron-testiselaimessa (Cypressin oma, deprecoitu ajuri) ensimmäinen
// klikkaus tuoreen sivulatauksen jälkeen ei aina rekisteröidy (tunnettu
// fokusongelma). Klikkaus varmistetaan tarkistamalla sivupalkin todellinen
// avautuminen ja yritetään tarvittaessa uudelleen, jotta jo auennutta
// valikkoa ei vahingossa suljeta klikkaamalla toistamiseen umpimähkäisesti.
export const openBurgerMenu = (): void => {
  cy.get(openMenuButton).click();
  isSidebarMenuOpen().then(isOpen => {
    if (!isOpen) {
      cy.get(openMenuButton).click({ force: true });
    }
  });
};

export const logout = (): Cypress.Chainable => cy.get(logoutSidebarLink).click({ force: true });

export const closeBurgerMenu = (): Cypress.Chainable => cy.get(closeMenuButton).click();

export const assertAboutLinkHref = (url: string): Cypress.Chainable => cy.get(aboutSidebarLink).should('have.attr', 'href', url);
