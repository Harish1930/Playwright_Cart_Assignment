import { expect, type Page } from '@playwright/test';
import type { Product } from './product-details.page';

export class CartPage {
  constructor(private readonly page: Page) {}

  private get rows() {
    return this.page.locator('#cart_info_table tbody tr');
  }

  private rowFor(name: string) {
    return this.rows.filter({ has: this.page.getByRole('link', { name, exact: true }) });
  }

  async open() {
    await this.page.goto('/view_cart');
  }

  async expectOnlyProducts(products: Product[]) {
    await expect(this.rows).toHaveCount(products.length);
    for (const product of products) {
      await expect(this.rowFor(product.name)).toHaveCount(1);
      await expect(this.rowFor(product.name).getByRole('link', {
        name: product.name, exact: true,
      })).toBeVisible();
    }
  }

  async expectProduct(product: Product, quantity: number) {
    const row = this.rowFor(product.name);
    await expect(row.locator('.cart_description').getByRole('link')).toHaveText(product.name);
    await expect(row.locator('.cart_price')).toHaveText(`Rs. ${product.unitPrice}`);
    await expect(row.locator('.cart_quantity')).toHaveText(String(quantity));
    await expect(row.locator('.cart_total')).toHaveText(`Rs. ${product.unitPrice * quantity}`);
  }

  async removeProduct(product: Product) {
    const row = this.rowFor(product.name);
    // The X link has no accessible name; scope its stable class to this product.
    await row.locator('a.cart_quantity_delete').click();
    await expect(row).toHaveCount(0);
  }

  async expectEmpty() {
    await expect(this.rows).toHaveCount(0);
    await expect(this.page.locator('#empty_cart')).toBeVisible();
    await expect(this.page.locator('#empty_cart')).toContainText('Cart is empty!');
  }
}
