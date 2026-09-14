# Testien ajaminen — Cypress-projekti

Ohjeet Cypress-testien ajamiseen puhtaassa ympäristössä, kun projekti on kloonattu GitHubista.

## Esivaatimukset

### 1. Git

Repositorion kloonaamiseen.

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y git
```

**macOS (Homebrew):**
```bash
brew install git
```

**Windows:**
```powershell
winget install --id Git.Git -e --source winget
```

### 2. Node.js (sisältää npm:n)

Vaatii **Node.js 18 tai uudemman**.

**Linux (Debian/Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS (Homebrew):**
```bash
brew install node
```

**Windows:**
```powershell
winget install OpenJS.NodeJS.LTS
```

Tarkista asennus:
```bash
node -v
npm -v
```

## Projektin käyttöönotto

### 1. Kloonaa repositorio

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Asenna riippuvuudet

```bash
npm install
```

Tämä asentaa `package.json`:ssa listatut paketit, mukaan lukien `cypress`-paketin. Cypressin testiajurin binääri ladataan **automaattisesti** tämän komennon yhteydessä (postinstall-skriptin kautta) — erillistä selainten asennuskomentoa ei yleensä tarvita.

Jos binäärin lataus epäonnistuu tai jää välistä (esim. CI-ympäristössä välimuistin vuoksi), se voidaan pakottaa manuaalisesti:
```bash
npx cypress install
```

### 3. Tarkista asennus (suositeltava)

```bash
npx cypress verify
```

Varmistaa, että Cypressin binääri on asentunut ja toimii oikein.

## Testien ajaminen

**Graafisella Test Runnerilla (interaktiivinen):**
```bash
npx cypress open
```

**Headless-tilassa (komentorivillä, ilman UI:ta):**
```bash
npx cypress run
```

## Yhteenveto

| Vaihe | Komento |
|---|---|
| Kloonaus | `git clone <url> && cd <kansio>` |
| Riippuvuudet + Cypress-binääri | `npm install` |
| (Tarvittaessa) binäärin lataus | `npx cypress install` |
| Tarkistus | `npx cypress verify` |
| Testit (UI) | `npx cypress open` |
| Testit (headless) | `npx cypress run` |

## Huomioita

- Virhe: 'Cannot find type definition file for 'node'. The file is in the program because: Entry point of type library 'node' specified in compilerOptions'. Korjaus: npm i -D @types/node - koska node-tyyppi oli tsconfig.json:ssa

- Test target on julkisesti saatavilla oleva verkkosivu; `baseUrl` on todennäköisesti jo kovakoodattu `cypress.config.js`/`.ts`-tiedostoon tai testeihin, joten erillistä ympäristökonfigurointia ei yleensä tarvita.
- Jos projekti käyttää `cypress.env.json`-tiedostoa tai `.env`-muuttujia, ne pitää dokumentoida erikseen ja lisätä esimerkkitiedosto (esim. `cypress.env.json.example`).

## Ero Playwrightiin

| | Playwright | Cypress |
|---|---|---|
| Selainbinäärit | Erillinen komento (`npx playwright install`) | Ladataan automaattisesti `npm install`-vaiheessa |
| Linux-riippuvuudet | `--with-deps`-lippu usein tarpeen | Yleensä ei erillisiä lisäkirjastoja tarvita samassa laajuudessa |
| Config-tiedosto | `playwright.config.ts` | `cypress.config.js`/`.ts` |
