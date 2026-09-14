export const defaultUserPostalCode = '01800';
export const defaultUserFirstName = 'Kerttu';
export const defaultUserSurName = 'Ketteryysguru';

export const portalHeader = 'Swag Labs';
export const portalHomeSecondaryHeader = 'Products';

// Sivunavigaation 'About'-linkin kohde portaalin ulkopuolella.
export const aboutPortalUrl = 'https://saucelabs.com/';

export const pathInventory = '/inventory.html'; // home landingpage

export const dataTest = (locator: string): string => `[data-test="${locator}"]`;
export const dataTestStartsWith = (prefix: string): string => `[data-test^="${prefix}"]`;

// pdf receipt at checkout e.g.:
// file:///home/aila/Downloads/swag-labs-order-2026-09-09_19-44-47.pdf

//must be in cypress.env.json (env: or expose:)
export const portalUrl: string = Cypress.expose('demoPortalUrl'); // Synchronous access
export const baseUrl: string = portalUrl.replace(/\/$/g, ''); // .TrimEnd('/');

export const defaultUsername: string = Cypress.expose('usernameDefault');

// remeber promise returned
// can use cmdline also CYPRESS_user_name_default=whatnot npx cypress open
// will override the one in cypress.env.json (env:),
// and also one in cypress.config.js, works if in (env:
export const defaultPassword = (): Cypress.Chainable<string> =>
  cy.env(['password_default']).then(({ password_default }: Record<string, string>) => password_default);
export const defaultUsernames = (): Cypress.Chainable<string> =>
  cy.env(['usernames_default']).then(({ usernames_default }: Record<string, string>) => usernames_default);

export const defaultUsernameArray = (namesString: string): string[] => namesString.split(/\s+/);

export const inventoryUrlRegex = (baseUrl: string): RegExp =>
  new RegExp(`^${baseUrl}${pathInventory}.*`);

export const parsePrice = (text: string): number => parseFloat(text.replace('$', ''));

// Yhteenveto-labelit sisältävät kiinteän tekstin ennen summaa
// (esim. "Item total: $0"), joten hinta poimitaan viimeisestä '$':sta alkaen.
export const parseTrailingPrice = (text: string): number => parsePrice(text.slice(text.indexOf('$')));

export interface OrderTotals {
  subtotal: string;
  tax: string;
  total: string;
}

// Sama laskentajärjestys kuin portaalin omassa summan/veron laskennassa:
// ensin summa, sitten 8% vero pyöristettynä, lopuksi summa + vero pyöristettynä.
export const calculateOrderTotals = (prices: number[]): OrderTotals => {
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (subtotal + parseFloat(tax)).toFixed(2);
  return { subtotal: subtotal.toFixed(2), tax, total };
};
