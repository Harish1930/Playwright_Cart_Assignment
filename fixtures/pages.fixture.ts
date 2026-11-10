import { test as base, expect } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { ProductDetailsPage } from '../pages/product-details.page';
import { ProductsPage } from '../pages/products.page';

type PageFixtures = {
  blockAds: void;
  cartPage: CartPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
};

export const test = base.extend<PageFixtures>({
  // External vignette ads intercept navigation clicks on this practice site.
  // Install routing before the first navigation; application requests stay live.
  blockAds: [async ({ context }, use) => {
    await context.route(
      /^https?:\/\/(?:[^/]+\.)?(?:googlesyndication\.com|doubleclick\.net|adtrafficquality\.google|fundingchoicesmessages\.google\.com)\//,
      route => route.abort(),
    );
    await use();
  }, { auto: true }],
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  productDetailsPage: async ({ page }, use) => { await use(new ProductDetailsPage(page)); },
});

export { expect };
