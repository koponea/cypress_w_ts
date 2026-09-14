import {
  defaultUsername,
  defaultUsernameArray,
  defaultUsernames,
  defaultPassword,
  inventoryUrlRegex,
  portalHeader,
  portalHomeSecondaryHeader,
  portalUrl,
  baseUrl,
  defaultUserFirstName,
  defaultUserSurName,
  defaultUserPostalCode,
  calculateOrderTotals,
  aboutPortalUrl,
} from '../utils/general-utils'
import * as login from '../utils/login'
import * as inventory from '../utils/inventory'
import * as details from '../utils/details'
import * as cart from '../utils/cart'
import * as checkoutInfo from '../utils/checkout-info'
import * as overview from '../utils/chckout-overview'
import * as checkoutComplete from '../utils/checkout-complete'

describe('Saucedemo features main scenarios', () => {

  it('Basic login with general access credentials', () => {
    cy.log('Logging in from baseUrl', portalUrl)

    cy.visit(portalUrl);
    cy.get('.login_logo').contains(portalHeader);

    defaultUsernames().then(names =>
      defaultUsernameArray(names)
        .forEach(username =>
            cy.get(login.loginCredentialsGrid)
                .contains(username)));

    defaultPassword().then(password =>
        cy.get(login.loginPasswordGrid)
            .contains(password));

    cy.get(login.usernameInput).type(defaultUsername);
    defaultPassword()
      .then(password => cy.get(login.passwordInput).type(password))
      .then(() => cy.get(login.loginButton).click())

    cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })
    cy.title().should('contains', portalHeader)
    cy.url().should('match', inventoryUrlRegex(baseUrl))
  })

  it('Linking outside the portal', () => {
    login.loginAsDefaultUser()

    inventory.addItemToCartAtIndex(0)
    inventory.assertCartBadgeCount(1)

    inventory.goToCart()
    cart.assertCartItemCount(1)

    inventory.openBurgerMenu()
    inventory.assertAboutLinkHref(aboutPortalUrl)
    inventory.closeBurgerMenu()

    cart.assertCartItemCount(1)

    cart.continueShopping()
    cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })
    inventory.assertCartBadgeCount(1)
  })

  describe('Shopping without intent to check-out', () => {
    it('Items can be browsed and de-carted with regular logout', () => {
      login.loginAsDefaultUser()

      inventory.addItemToCartAtIndex(0)
      inventory.assertCartBadgeCount(1)

      inventory.addItemToCartAtIndex(1)
      inventory.assertCartBadgeCount(2)

      inventory.getItemNameAtIndex(2).then(browsedItemName => {
        inventory.openItemDetailsAtIndex(2)
        details.getItemName().should('eq', browsedItemName)
      })

      details.backToProducts()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventory.removeItemFromCartAtIndex(0)
      inventory.assertCartBadgeCount(1)

      inventory.getItemNameAtIndex(1).then(remainingItemName => {
        inventory.goToCart()
        cart.getItemNameAtIndex(0).should('eq', remainingItemName)
        cart.removeItemAtIndex(0)
      })

      cart.assertCartIsEmpty()
      inventory.assertCartBadgeAbsent()

      cart.continueShopping()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventory.openBurgerMenu()
      inventory.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(login.usernameInput).should('be.visible')
    })

    it('Bailing out mid shopping', () => {
      login.loginAsDefaultUser()

      inventory.addItemToCartAtIndex(0)
      inventory.assertCartBadgeCount(1)

      inventory.addItemToCartAtIndex(1)
      inventory.assertCartBadgeCount(2)

      inventory.openBurgerMenu()
      inventory.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(login.usernameInput).should('be.visible')
    })
  })

  describe('Shopping with intent to check-out', () => {
    it('Checking out with purchase and receipt', () => {
      login.loginAsDefaultUser()

      const itemPrices: number[] = []

      inventory.getItemPriceAtIndex(0).then(price => itemPrices.push(price))
      inventory.addItemToCartAtIndex(0)
      inventory.assertCartBadgeCount(1)

      inventory.getItemPriceAtIndex(1).then(price => itemPrices.push(price))
      inventory.addItemToCartAtIndex(1)
      inventory.assertCartBadgeCount(2)

      inventory.goToCart()
      cart.goToCheckout()

      checkoutInfo.fillBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfo.assertBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfo.continueToOverview()

      cy.then(() => overview.assertOrderTotals(calculateOrderTotals(itemPrices)))

      // Kuitin tiedostonimi perustuu "Finish"-klikkaushetken kellonaikaan,
      // joten kello jäädytetään juuri ennen sitä, jotta ladatun pdf:n
      // tiedostonimi on ennustettavissa ja varmennettavissa.
      const orderTimestamp = new Date()
      cy.clock(orderTimestamp, ['Date'])

      overview.finish()
      checkoutComplete.assertOrderComplete()

      checkoutComplete.generatePdfOrder()
      checkoutComplete.assertReceiptPdfDownloaded(checkoutComplete.expectedReceiptFileName(orderTimestamp))

      cy.clock().invoke('restore')

      checkoutComplete.backHome()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventory.openBurgerMenu()
      inventory.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(login.usernameInput).should('be.visible')
    })

    it('Cheking out with no purchase', () => {
      login.loginAsDefaultUser()

      inventory.addItemToCartAtIndex(0)
      inventory.assertCartBadgeCount(1)

      inventory.addItemToCartAtIndex(1)
      inventory.assertCartBadgeCount(2)

      inventory.goToCart()

      cart.removeItemAtIndex(0)
      cart.removeItemAtIndex(0)
      cart.assertCartIsEmpty()
      inventory.assertCartBadgeAbsent()

      cart.goToCheckout()

      checkoutInfo.fillBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfo.assertBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfo.continueToOverview()

      overview.assertNoItemsInOrder()
      overview.assertOrderTotals(calculateOrderTotals([]))

      // Kuitin tiedostonimi perustuu "Finish"-klikkaushetken kellonaikaan,
      // joten kello jäädytetään juuri ennen sitä, jotta ladatun pdf:n
      // tiedostonimi on ennustettavissa ja varmennettavissa.
      const orderTimestamp = new Date()
      cy.clock(orderTimestamp, ['Date'])

      overview.finish()
      checkoutComplete.assertOrderComplete()

      checkoutComplete.generatePdfOrder()
      checkoutComplete.assertReceiptPdfDownloaded(checkoutComplete.expectedReceiptFileName(orderTimestamp))

      cy.clock().invoke('restore')

      checkoutComplete.backHome()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventory.openBurgerMenu()
      inventory.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(login.usernameInput).should('be.visible')
    })
  })

})
