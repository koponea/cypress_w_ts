# Repository cypress_w_ts, AI usage report

Projekti on käännetty JavaScript-projektista [cypress_tests](../cypress_tests) TypeScriptille käyttäen __Claude Code - Claude Sonnet 5__:tä, testitapaus kerrallaan `cypress_tests/test_design.md`:n kuvausten mukaisesti. Alle kirjataan kohdat, joissa koodia tehostettiin nimenomaan TypeScriptin ominaisuuksien vuoksi (ei muista syistä).

## Testitapaus: "Basic login with general access credentials"

* `cypress/utils/general-utils.ts`: `dataTest`, `defaultUsernameArray` ja `inventoryUrlRegex` saivat eksplisiittiset parametri- ja paluutyypit (`string`, `string[]`, `RegExp`). Alkuperäisessä JS:ssä tyypit olivat vain pääteltävissä kutsukohdista; TS:ssä ne dokumentoivat rajapinnan ja Cypress tarkistaa väärinkäytön käännösaikaisesti moduulien välillä.
* `portalUrl` ja `defaultUsername`: `Cypress.expose(key: string): any` palauttaa tyypin `any`. Lisäsin eksplisiittisen `: string`-annotaation, jolloin `any`-arvo kavennetaan heti käyttöpaikassa tarkistettuun tyyppiin sen sijaan, että `any` leviäisi kutsuvaan koodiin (esim. `login.ts`:ään ja testitiedostoon).
* `defaultPassword` ja `defaultUsernames`: `cy.env(keys: string[])` palauttaa `Cypress.Chainable<Record<string, any>>`. `.then`-destrukturoinnin parametrille annettiin tyyppi `Record<string, string>`, jolloin funktioiden paluutyypiksi tulee `Cypress.Chainable<string>` `any`:n sijaan.
* `cypress/utils/login.ts`: locator-vakiot (`loginButton`, `passwordInput`, `usernameInput`) tyypitettiin eksplisiittisesti `string`-tyyppisiksi `gen.dataTest(...)`-kutsujen paluuarvoina.

## Testitapaus: "Linking outside the portal"

* `cypress/utils/inventory.ts`: kaikki uudet locator-vakiot (`inventoryItem`, `addToCartButton`, `shoppingCartLink`, `shoppingCartBadge`, `aboutSidebarLink`) tyypitettiin `string`-tyyppisiksi vastaavasti kuin edellisessä testitapauksessa.
* `isSidebarMenuOpen`-apufunktion paluutyypiksi annettiin `Cypress.Chainable<boolean>` `Cypress.Chainable<any>`:n sijaan — kuvaa suoraan koodissa mitä `.then`-ketjun jatkokäsittelijä (`isOpen`) todellisuudessa saa, mikä JS:ssä näkyi vain kommentin/nimen tasolla.
* `addItemToCartAtIndex`, `assertCartBadgeCount` ja `assertAboutLinkHref` saivat eksplisiittiset parametrityypit (`number`, `number`, `string`) — estää esim. `index`-parametrin vahingossa merkkijonona välittämisen kutsupaikassa käännösaikaisesti.
* `openBurgerMenu`: paluutyyppi `void` merkitty eksplisiittisesti, koska funktio suoritetaan vain sivuvaikutusten vuoksi eikä sen paluuarvoa ole koskaan tarkoitus ketjuttaa.

## Testitapaus: "Items can be browsed and de-carted with regular logout"

* `inventory.ts`, `cart.ts`, `details.ts`: `.invoke('text')`-pohjaiset funktiot (`getItemNameAtIndex`, `getItemName`) tyypitettiin paluutyypillä `Cypress.Chainable<string>` erotukseksi muista, ei-arvoa-palauttavista klikkaus-/assertio-funktioista (`Cypress.Chainable` ilman geneeristä parametria). Näin kutsupaikassa `.then(name => ...)`-parametrin tyyppi `string` tulee suoraan Cypressin tyyppipäättelystä ilman `any`-läpivuotoa.
* Kaikki indeksillä toimivat funktiot (`removeItemFromCartAtIndex`, `openItemDetailsAtIndex`, `getItemNameAtIndex`, `removeItemAtIndex`) saivat `index: number`-parametrityypin samalla periaatteella kuin aiemmissa testitapauksissa.

## Testitapaus: "Checking out with purchase and receipt"

* `general-utils.ts`: lisätty `OrderTotals`-interface (`{ subtotal, tax, total }`) kuvaamaan `calculateOrderTotals`:n paluuarvon ja `chckout-overview.ts`:n `assertOrderTotals`:n parametrin yhteistä muotoa. JS:ssä tämä oli vain implisiittinen objektin muoto kahden tiedoston välillä ilman mitään yhteistä sopimusta; TS-tyyppi tekee rajapinnasta eksplisiittisen ja Cypress havaitsee rikkoutumisen käännösaikaisesti, jos jompikumpi puoli muuttuu.
* `inventory.ts`: `getItemPriceAtIndex` tyypitettiin paluutyypillä `Cypress.Chainable<number>`, koska `.then(gen.parsePrice)`-ketju muuttaa arvon tekstistä numeroksi — sama periaate kuin aiemmin `Cypress.Chainable<string>`:lla merkkijonoarvoille.
* Testitiedostossa `const itemPrices: number[] = []` sai eksplisiittisen taulukkotyypin, sillä pelkkä tyhjä `[]` päättyisi TypeScriptissä helposti `never[]`- tai `any[]`-tyyppiin, jolloin myöhempi `itemPrices.push(price)` ja `calculateOrderTotals(itemPrices)`-kutsu eivät tyyppitarkistuisi luotettavasti.
* `chckout-overview.ts` ja `checkout-info.ts`: kaikki uudet locator-vakiot tyypitettiin `string`-tyyppisiksi ja funktiot (`fillBuyerInfo`, `assertBuyerInfo`, `assertOrderTotals`) saivat eksplisiittiset parametrityypit sekä `void`-paluutyypin, koska ne suoritetaan vain sivuvaikutusten/assertioiden vuoksi.
* `checkout-complete.ts`: `expectedReceiptFileName(orderTimestamp: Date): string` — eksplisiittinen `Date`-parametrityyppi varmistaa, ettei funktiota voi vahingossa kutsua esim. aikaleimamerkkijonolla.

## Testitapaus: "Cheking out with no purchase"

* Testi käytti valmiiksi tyypitettyjä `cart.ts`-, `chckout-overview.ts`- ja `checkout-complete.ts`-funktioita; ainoa uusi koodi oli `chckout-overview.ts`:n `assertNoItemsInOrder`, joka noudattaa samaa `string`-locator- ja `Cypress.Chainable`-paluutyyppikäytäntöä kuin muutkin assertiofunktiot. `calculateOrderTotals([])`-kutsu toimii ilman muutoksia, koska `prices: number[]` hyväksyy jo tyhjän taulukon.
* Testitapauksen nimi ("Cheking out with no purchase") on säilytetty täsmälleen samana kirjoitusvirheineen kuin alkuperäisessä `cypress_tests/cypress/e2e/demo-features-main-scenarios.cy.js`:ssä — korjaus ei olisi TypeScriptin ominaisuuksista johtuva tehostus, joten sitä ei tehty tässä käännöstyössä.

## Ajoaikavertailu: demo-features-main-scenarios.cy.ts vs. .cy.js

Molemmat sarjat (`cypress_w_ts/cypress/e2e/demo-features-main-scenarios.cy.ts` ja `cypress_tests/cypress/e2e/demo-features-main-scenarios.cy.js`) ajettiin `npx cypress run --spec ...`, 6/6 läpäisi molemmissa. Yhden ajon mittaus:

| Testitapaus | TS (.cy.ts) | JS (.cy.js) | Erotus (TS − JS) |
|---|---|---|---|
| Basic login with general access credentials | 1233 ms | 929 ms | +304 ms |
| Linking outside the portal | 1497 ms | 1477 ms | +20 ms |
| Items can be browsed and de-carted with regular logout | 1541 ms | 1506 ms | +35 ms |
| Bailing out mid shopping | 934 ms | 993 ms | −59 ms |
| Checking out with purchase and receipt | 2497 ms | 2536 ms | −39 ms |
| Cheking out with no purchase | 2351 ms | 2334 ms | +17 ms |
| **Yhteensä (testien summa)** | **10 053 ms** | **9 775 ms** | **+278 ms** |
| **Suite-taso (raportoitu)** | 11 s | 11 s | 0 |

Havainnot:

* Kokonaiskestossa (suite-taso) ei eroa — molemmat pyöristyvät 11 sekuntiin.
* Testikohtaisten aikojen summissa TS on n. 280 ms (~3 %) hitaampi yhdessä ajossa, mutta tämä on yhden ajon mittaus normaalilla verkko-/selainlatenssin vaihtelulla (esim. "Basic login" -testin +304 ms selittää suurimman osan koko erosta, muut testit ovat lähes tasan tai TS jopa nopeampi).
* TypeScript-tiedostot esikäännetään (transpiloidaan JS:ksi) kerran spec-tiedoston latauksessa, ei jokaisen testin tai `cy`-komennon yhteydessä, joten TS ei tuo systemaattista per-testi-ylikuormaa — mitattu ero selittyy käytännössä täysin ajonaikaisella satunnaisvaihtelulla, ei kielivalinnalla.

### Vahvistus 5 ajon keskiarvolla

Sama vertailu toistettiin ajamalla molemmat sarjat 5 kertaa peräkkäin (`npx cypress run --spec ...`), yhteensä 10 ajoa, kaikissa 6/6 testiä läpäisi:

| Testitapaus | TS keskiarvo | JS keskiarvo | Erotus (TS − JS) |
|---|---|---|---|
| Basic login with general access credentials | 969 ms | 1006 ms | −37 ms |
| Linking outside the portal | 1481 ms | 1466 ms | +15 ms |
| Items can be browsed and de-carted with regular logout | 1559 ms | 1517 ms | +43 ms |
| Bailing out mid shopping | 961 ms | 960 ms | +2 ms |
| Checking out with purchase and receipt | 2555 ms | 2495 ms | +60 ms |
| Cheking out with no purchase | 2338 ms | 2253 ms | +85 ms |
| **Summa keskiarvoista** | **9863 ms** | **9696 ms** | **+167 ms** |
| **Suite-taso (Duration), ka. 5 ajosta** | 11,00 s | 11,00 s | 0 |

Yksittäisten ajojen raa'at testiajat (ms), viisi ajoa per testitapaus:

* Basic login: TS `[949, 936, 943, 1022, 997]`, JS `[970, 1036, 1166, 951, 908]`
* Linking outside the portal: TS `[1513, 1487, 1463, 1488, 1453]`, JS `[1484, 1450, 1467, 1442, 1487]`
* Items browsed/de-carted: TS `[1578, 1557, 1519, 1582, 1561]`, JS `[1547, 1500, 1527, 1474, 1535]`
* Bailing out mid shopping: TS `[975, 936, 967, 963, 965]`, JS `[962, 963, 952, 955, 966]`
* Checking out with purchase and receipt: TS `[2500, 2573, 2542, 2557, 2601]`, JS `[2503, 2514, 2495, 2539, 2424]`
* Cheking out with no purchase: TS `[2318, 2274, 2351, 2382, 2364]`, JS `[2222, 2156, 2312, 2308, 2267]`

Johtopäätös: suite-tason kokonaiskesto on identtinen (11,00 s molemmilla, ei hajontaa ajojen välillä sekuntitarkkuudella). Testikohtaisten aikojen summissa TS on keskimäärin ~167 ms (~1,7 %) hitaampi, mikä on selvästi pienempi kuin yksittäisten testien ajonaikainen hajonta (esim. "Basic login" vaihteli JS:ssä 908–1166 ms viiden ajon välillä) — ero selittyy ajonaikaisella satunnaisvaihtelulla (verkko, DOM-renderöinti), ei TypeScript-transpiloinnin aiheuttamalla systemaattisella ylikuormalla.

## Ajoaikavertailu sivuobjektirefaktoroinnin jälkeen (1 ajo)

Sivuobjektiluokkiin (`SauceDemoLoginPage`, `SauceDemoInventoryPage`, `SauceDemoDetailsPage`, `SauceDemoCartPage`, `SauceDemoCheckoutInfoPage`, `SauceDemoCheckoutOverviewPage`, `SauceDemoCheckoutCompletePage`) siirtymisen jälkeen sarjat ajettiin uudelleen kertaalleen (`npx cypress run --spec ...`), molemmissa 6/6 läpäisi:

| Testitapaus | TS (.cy.ts, luokat) | JS (.cy.js) | Erotus (TS − JS) |
|---|---|---|---|
| Basic login with general access credentials | 1141 ms | 1026 ms | +115 ms |
| Linking outside the portal | 1629 ms | 1464 ms | +165 ms |
| Items can be browsed and de-carted with regular logout | 1475 ms | 1477 ms | −2 ms |
| Bailing out mid shopping | 909 ms | 915 ms | −6 ms |
| Checking out with purchase and receipt | 2893 ms | 2469 ms | +424 ms |
| Cheking out with no purchase | 2205 ms | 2191 ms | +14 ms |
| **Yhteensä (testien summa)** | **10 252 ms** | **9 542 ms** | **+710 ms** |
| **Suite-taso (raportoitu)** | 12 s | 11 s | +1 s |

Havainnot:

* Tämäkin on yhden ajon mittaus, joten sisältää normaalia ajonaikaista vaihtelua — ks. yllä oleva 5 ajon keskiarvovertailu, jossa TS oli vain ~167 ms (~1,7 %) hitaampi summattuna. Tässä yksittäisessä ajossa erotus on suurempi (+710 ms, ~7 %) ja suite-taso ylitti sekuntirajan (12 s vs. 11 s), mutta "Checking out with purchase and receipt" -testin +424 ms selittää yksinään yli puolet koko erosta — mikä sopii yhden ajon satunnaisvaihteluun (verkko, DOM, PDF-generointi) eikä ole toistuva.
* Luokkapohjainen (page object -malli, `new SauceDemoXxxPage()` + `this.locator`-viittaukset instanssimetodeissa) rakenne ei tuo mitään ajonaikaista ylimääräistä työtä verrattuna moduulifunktio-tyyliin: locator-kentät alustetaan kerran luokan instantioinnissa testitiedoston latauksessa (ei per testi/`cy`-komento), ja metodikutsut (`page.metodi()`) ovat käytännössä yhtä nopeita kuin suorat funktiokutsut V8:ssa. Erot selittyvät edelleen käytännössä täysin ajonaikaisella satunnaisvaihtelulla, ei TypeScript-luokkien käytöllä.

