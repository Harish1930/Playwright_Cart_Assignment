# Assignment 2: Cart verification

Playwright + TypeScript test for https://automationexercise.com/, using page objects and typed page fixtures. No login is required.

## Run

```sh
npm ci
npx playwright install chromium
npm test
```

Use `npm run test:headed` to see the browser, `npm run test:ui` for interactive execution, `npm run typecheck` for TypeScript validation, and `npm run report` to open the HTML report. Failed runs retain a trace and screenshot.

## Structure

- `pages/`: catalog navigation, product details and add-to-cart modal, cart assertions and removal.
- `fixtures/pages.fixture.ts`: test-scoped page objects sharing Playwright's isolated browser page/context.
- `tests/cart.spec.ts`: the complete assignment as named test steps.
- `playwright.config.ts`: Chromium configuration and failure diagnostics.

The test verifies an empty cart first, selects the first two catalog products through **View Product**, captures their detail-page names and prices, and explicitly sets quantities to 3 and 1. It checks exact cart membership, names, unit prices, quantities, calculated totals, the remaining product after the first removal, and the empty message plus zero rows after the final removal.

Locators use roles and visible names where available. Small scoped CSS selectors cover the site's unnamed X link and cart fields. Playwright's retrying assertions and locator auto-waiting handle updates; there are no fixed waits or XPath expressions. Internet access to the live application is required.

An automatic fixture blocks external ad providers because vignette overlays on this site can intercept navigation. All product and cart requests use the live application; no application responses are mocked.
