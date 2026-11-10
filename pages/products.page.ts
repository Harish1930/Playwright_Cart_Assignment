import { expect, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.locator('header').getByRole('link', { name: 'Products' }).click();
    await this.page.waitForLoadState('load');
    await expect(this.page.getByRole('heading', { name: 'All Products', exact: true })).toBeVisible();
  }

  async viewProduct(index: number) {
    // Restrict to the catalog so recommended products cannot affect selection.
    await this.page.locator('.features_items').getByRole('link', {
      name: /View Product/,
    }).nth(index).click();
    await this.page.waitForLoadState('load');
    await expect(this.page.locator('.product-information')).toBeVisible();
  }
}
