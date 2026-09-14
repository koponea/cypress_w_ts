import * as gen from '../utils/general-utils'

export class SauceDemoInventoryPage {
  /** locators */
  readonly inventoryItem: string = gen.dataTest('inventory-item');
  readonly inventoryItemName: string = gen.dataTest('inventory-item-name');
  readonly inventoryItemPrice: string = gen.dataTest('inventory-item-price');
  readonly addToCartButton: string = gen.dataTestStartsWith('add-to-cart-');
  readonly removeFromCartButton: string = gen.dataTestStartsWith('remove-');
  readonly shoppingCartLink: string = gen.dataTest('shopping-cart-link');
  readonly shoppingCartBadge: string = gen.dataTest('shopping-cart-badge');
  // react-burger-menu-kirjaston lisäämä todellinen klikattava nappi, ei omaa data-test-attribuuttia
  // (data-test="open-menu" on vain kuvake, jonka nappi peittää eikä ole sen esi-isä)
  readonly openMenuButton = '#react-burger-menu-btn';
  // Sama react-burger-menu-kirjaston rajoitus kuin openMenuButtonilla: oikea
  // klikattava sulkunappi ei kanna data-test-attribuuttia, vain sen sisällä
  // oleva kuvake (data-test="close-menu").
  readonly closeMenuButton = '.bm-cross-button';
  readonly logoutSidebarLink: string = gen.dataTest('logout-sidebar-link');
  readonly aboutSidebarLink: string = gen.dataTest('about-sidebar-link');

  /** methods */
  addItemToCartAtIndex(index: number): Cypress.Chainable {
    return cy.get(this.inventoryItem).eq(index).find(this.addToCartButton).click();
  }

  removeItemFromCartAtIndex(index: number): Cypress.Chainable {
    return cy.get(this.inventoryItem).eq(index).find(this.removeFromCartButton).click();
  }

  openItemDetailsAtIndex(index: number): Cypress.Chainable {
    return cy.get(this.inventoryItemName).eq(index).click();
  }

  getItemNameAtIndex(index: number): Cypress.Chainable<string> {
    return cy.get(this.inventoryItem).eq(index).find(this.inventoryItemName).invoke('text');
  }

  getItemPriceAtIndex(index: number): Cypress.Chainable<number> {
    return cy.get(this.inventoryItem).eq(index).find(this.inventoryItemPrice).invoke('text').then(gen.parsePrice);
  }

  assertCartBadgeCount(count: number): Cypress.Chainable {
    return cy.get(this.shoppingCartBadge).should('have.text', String(count));
  }

  assertCartBadgeAbsent(): Cypress.Chainable {
    return cy.get(this.shoppingCartBadge).should('not.exist');
  }

  goToCart(): Cypress.Chainable {
    return cy.get(this.shoppingCartLink).click();
  }

  private isSidebarMenuOpen(): Cypress.Chainable<boolean> {
    return cy.get('.bm-menu-wrap').then($wrap => !getComputedStyle($wrap[0]).transform.includes('-300'));
  }

  // Electron-testiselaimessa (Cypressin oma, deprecoitu ajuri) ensimmäinen
  // klikkaus tuoreen sivulatauksen jälkeen ei aina rekisteröidy (tunnettu
  // fokusongelma). Klikkaus varmistetaan tarkistamalla sivupalkin todellinen
  // avautuminen ja yritetään tarvittaessa uudelleen, jotta jo auennutta
  // valikkoa ei vahingossa suljeta klikkaamalla toistamiseen umpimähkäisesti.
  openBurgerMenu(): void {
    cy.get(this.openMenuButton).click();
    this.isSidebarMenuOpen().then(isOpen => {
      if (!isOpen) {
        cy.get(this.openMenuButton).click({ force: true });
      }
    });
  }

  logout(): Cypress.Chainable {
    return cy.get(this.logoutSidebarLink).click({ force: true });
  }

  closeBurgerMenu(): Cypress.Chainable {
    return cy.get(this.closeMenuButton).click();
  }

  assertAboutLinkHref(url: string): Cypress.Chainable {
    return cy.get(this.aboutSidebarLink).should('have.attr', 'href', url);
  }
}
