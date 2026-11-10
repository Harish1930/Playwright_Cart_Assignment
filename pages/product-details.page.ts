import { expect, type Page } from '@playwright/test';

export type Product = { name: string; unitPrice: number };

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  async captureProduct(): Promise<Product> {
    const information = this.page.locator('.product-information');
    const name = (await information.getByRole('heading', { level: 2 }).innerText()).trim();
    const priceText = await information.getByText(/^Rs\.\s*[\d,]+(?:\.\d{1,2})?$/).innerText();
    const unitPrice = Number(priceText.replace(/^Rs\.\s*/, '').replaceAll(',', ''));
    expect(name).not.toBe('');
    expect(unitPrice).toBeGreaterThan(0);
    return { name, unitPrice };
  }

  async addToCart(quantity: number) {
    // The visible Quantity label has no `for` attribute; use the input's role.
    await this.page.getByRole('spinbutton').fill(String(quantity));
    await this.page.getByRole('button', { name: /Add to cart/ }).click();
    await expect(this.page.locator('#cartModal')).toBeVisible();
    await expect(this.page.locator('#cartModal')).toContainText('Your product has been added to cart.');
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping', exact: true }).click();
    await expect(this.page.locator('#cartModal')).toBeHidden();
  }

  async viewCart() {
    await this.page.locator('#cartModal').getByRole('link', { name: 'View Cart', exact: true }).click();
    await expect(this.page).toHaveURL(/\/view_cart$/);
    // Cart controls are visible before the footer scripts bind their handlers.
    await this.page.waitForLoadState('load');
  }
}
