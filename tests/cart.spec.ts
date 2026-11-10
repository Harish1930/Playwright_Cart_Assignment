import { test, expect } from '../fixtures/pages.fixture';
import type { Product } from '../pages/product-details.page';

test('verify cart contents, quantities, prices, and removal', async ({
  cartPage, productsPage, productDetailsPage,
}) => {
  let first: Product;
  let second: Product;

  await test.step('Start with an empty cart in a fresh guest session', async () => {
    await cartPage.open();
    await cartPage.expectEmpty();
  });

  await test.step('Capture the first product and add three units', async () => {
    await productsPage.open();
    await productsPage.viewProduct(0);
    first = await productDetailsPage.captureProduct();
    await productDetailsPage.addToCart(3);
    await productDetailsPage.continueShopping();
  });

  await test.step('Capture a different product and add one unit', async () => {
    await productsPage.open();
    await productsPage.viewProduct(1);
    second = await productDetailsPage.captureProduct();
    expect(second.name).not.toBe(first.name);
    await productDetailsPage.addToCart(1);
    await productDetailsPage.viewCart();
  });

  await test.step('Verify exactly two products and every cart value', async () => {
    await cartPage.expectOnlyProducts([first, second]);
    await cartPage.expectProduct(first, 3);
    await cartPage.expectProduct(second, 1);
  });

  await test.step('Remove the first product and verify the second remains intact', async () => {
    await cartPage.removeProduct(first);
    await cartPage.expectOnlyProducts([second]);
    await cartPage.expectProduct(second, 1);
  });

  await test.step('Remove the second product and verify the empty cart', async () => {
    await cartPage.removeProduct(second);
    await cartPage.expectEmpty();
  });
});
