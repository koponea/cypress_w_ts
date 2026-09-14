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
import { SauceDemoLoginPage } from '../utils/login'
import { SauceDemoInventoryPage } from '../utils/inventory'
import { SauceDemoDetailsPage } from '../utils/details'
import { SauceDemoCartPage } from '../utils/cart'
import { SauceDemoCheckoutInfoPage } from '../utils/checkout-info'
import { SauceDemoCheckoutOverviewPage } from '../utils/chckout-overview'
import { SauceDemoCheckoutCompletePage } from '../utils/checkout-complete'

const loginPage = new SauceDemoLoginPage()
const inventoryPage = new SauceDemoInventoryPage()
const detailsPage = new SauceDemoDetailsPage()
const cartPage = new SauceDemoCartPage()
const checkoutInfoPage = new SauceDemoCheckoutInfoPage()
const overviewPage = new SauceDemoCheckoutOverviewPage()
const checkoutCompletePage = new SauceDemoCheckoutCompletePage()

describe('Saucedemo features main scenarios', () => {

  it('Basic login with general access credentials', () => {
    cy.log('Logging in from baseUrl', portalUrl)

    cy.visit(portalUrl);
    cy.get('.login_logo').contains(portalHeader);

    defaultUsernames().then(names =>
      defaultUsernameArray(names)
        .forEach(username =>
            cy.get(loginPage.loginCredentialsGrid)
                .contains(username)));

    defaultPassword().then(password =>
        cy.get(loginPage.loginPasswordGrid)
            .contains(password));

    cy.get(loginPage.usernameInput).type(defaultUsername);
    defaultPassword()
      .then(password => cy.get(loginPage.passwordInput).type(password))
      .then(() => cy.get(loginPage.loginButton).click())

    cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })
    cy.title().should('contains', portalHeader)
    cy.url().should('match', inventoryUrlRegex(baseUrl))
  })

  it('Linking outside the portal', () => {
    loginPage.loginAsDefaultUser()

    inventoryPage.addItemToCartAtIndex(0)
    inventoryPage.assertCartBadgeCount(1)

    inventoryPage.goToCart()
    cartPage.assertCartItemCount(1)

    inventoryPage.openBurgerMenu()
    inventoryPage.assertAboutLinkHref(aboutPortalUrl)
    inventoryPage.closeBurgerMenu()

    cartPage.assertCartItemCount(1)

    cartPage.continueShopping()
    cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })
    inventoryPage.assertCartBadgeCount(1)
  })

  describe('Shopping without intent to check-out', () => {
    it('Items can be browsed and de-carted with regular logout', () => {
      loginPage.loginAsDefaultUser()

      inventoryPage.addItemToCartAtIndex(0)
      inventoryPage.assertCartBadgeCount(1)

      inventoryPage.addItemToCartAtIndex(1)
      inventoryPage.assertCartBadgeCount(2)

      inventoryPage.getItemNameAtIndex(2).then(browsedItemName => {
        inventoryPage.openItemDetailsAtIndex(2)
        detailsPage.getItemName().should('eq', browsedItemName)
      })

      detailsPage.backToProducts()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventoryPage.removeItemFromCartAtIndex(0)
      inventoryPage.assertCartBadgeCount(1)

      inventoryPage.getItemNameAtIndex(1).then(remainingItemName => {
        inventoryPage.goToCart()
        cartPage.getItemNameAtIndex(0).should('eq', remainingItemName)
        cartPage.removeItemAtIndex(0)
      })

      cartPage.assertCartIsEmpty()
      inventoryPage.assertCartBadgeAbsent()

      cartPage.continueShopping()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventoryPage.openBurgerMenu()
      inventoryPage.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(loginPage.usernameInput).should('be.visible')
    })

    it('Bailing out mid shopping', () => {
      loginPage.loginAsDefaultUser()

      inventoryPage.addItemToCartAtIndex(0)
      inventoryPage.assertCartBadgeCount(1)

      inventoryPage.addItemToCartAtIndex(1)
      inventoryPage.assertCartBadgeCount(2)

      inventoryPage.openBurgerMenu()
      inventoryPage.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(loginPage.usernameInput).should('be.visible')
    })
  })

  describe('Shopping with intent to check-out', () => {
    it('Checking out with purchase and receipt', () => {
      loginPage.loginAsDefaultUser()

      const itemPrices: number[] = []

      inventoryPage.getItemPriceAtIndex(0).then(price => itemPrices.push(price))
      inventoryPage.addItemToCartAtIndex(0)
      inventoryPage.assertCartBadgeCount(1)

      inventoryPage.getItemPriceAtIndex(1).then(price => itemPrices.push(price))
      inventoryPage.addItemToCartAtIndex(1)
      inventoryPage.assertCartBadgeCount(2)

      inventoryPage.goToCart()
      cartPage.goToCheckout()

      checkoutInfoPage.fillBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfoPage.assertBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfoPage.continueToOverview()

      cy.then(() => overviewPage.assertOrderTotals(calculateOrderTotals(itemPrices)))

      // Kuitin tiedostonimi perustuu "Finish"-klikkaushetken kellonaikaan,
      // joten kello jäädytetään juuri ennen sitä, jotta ladatun pdf:n
      // tiedostonimi on ennustettavissa ja varmennettavissa.
      const orderTimestamp = new Date()
      cy.clock(orderTimestamp, ['Date'])

      overviewPage.finish()
      checkoutCompletePage.assertOrderComplete()

      checkoutCompletePage.generatePdfOrder()
      checkoutCompletePage.assertReceiptPdfDownloaded(checkoutCompletePage.expectedReceiptFileName(orderTimestamp))

      cy.clock().invoke('restore')

      checkoutCompletePage.backHome()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventoryPage.openBurgerMenu()
      inventoryPage.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(loginPage.usernameInput).should('be.visible')
    })

    it('Cheking out with no purchase', () => {
      loginPage.loginAsDefaultUser()

      inventoryPage.addItemToCartAtIndex(0)
      inventoryPage.assertCartBadgeCount(1)

      inventoryPage.addItemToCartAtIndex(1)
      inventoryPage.assertCartBadgeCount(2)

      inventoryPage.goToCart()

      cartPage.removeItemAtIndex(0)
      cartPage.removeItemAtIndex(0)
      cartPage.assertCartIsEmpty()
      inventoryPage.assertCartBadgeAbsent()

      cartPage.goToCheckout()

      checkoutInfoPage.fillBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfoPage.assertBuyerInfo(defaultUserFirstName, defaultUserSurName, defaultUserPostalCode)
      checkoutInfoPage.continueToOverview()

      overviewPage.assertNoItemsInOrder()
      overviewPage.assertOrderTotals(calculateOrderTotals([]))

      // Kuitin tiedostonimi perustuu "Finish"-klikkaushetken kellonaikaan,
      // joten kello jäädytetään juuri ennen sitä, jotta ladatun pdf:n
      // tiedostonimi on ennustettavissa ja varmennettavissa.
      const orderTimestamp = new Date()
      cy.clock(orderTimestamp, ['Date'])

      overviewPage.finish()
      checkoutCompletePage.assertOrderComplete()

      checkoutCompletePage.generatePdfOrder()
      checkoutCompletePage.assertReceiptPdfDownloaded(checkoutCompletePage.expectedReceiptFileName(orderTimestamp))

      cy.clock().invoke('restore')

      checkoutCompletePage.backHome()
      cy.contains(portalHomeSecondaryHeader, { timeout: 20000 })

      inventoryPage.openBurgerMenu()
      inventoryPage.logout()

      cy.get('.login_logo').contains(portalHeader)
      cy.get(loginPage.usernameInput).should('be.visible')
    })
  })

})
