import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {

  test('Signup page loads (/signup)', async ({ page }) => {
    const response = await page.goto('/signup');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*signup/);

    // Should have a form
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('Login page loads (/login)', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*login/);

    // Should have a form
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('Forgot password page loads (/forgot-password)', async ({ page }) => {
    const response = await page.goto('/forgot-password');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test('NO /register route should exist', async ({ page }) => {
    const response = await page.goto('/register');

    // Should either 404 or redirect to /signup
    const finalURL = page.url();
    const is404 = response?.status() === 404;
    const redirectedToSignup = finalURL.includes('/signup');

    expect(is404 || redirectedToSignup, '❌ /register should not exist or should redirect to /signup').toBeTruthy();
  });

  test('All signup links point to /signup (NOT /register)', async ({ page }) => {
    await page.goto('/');

    // Check all links on page
    const allLinks = await page.locator('a').all();

    for (const link of allLinks) {
      const href = await link.getAttribute('href');
      if (href === '/register') {
        console.log('❌ FOUND: Link pointing to /register (should be /signup)');
        expect(href).not.toBe('/register');
      }
    }
  });
});
