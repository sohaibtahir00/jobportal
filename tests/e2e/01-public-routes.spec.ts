import { test, expect } from '@playwright/test';

test.describe('Public Routes - Page Load Tests', () => {

  test('01. Home page (/)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Check for common elements
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Log any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error on Home:', msg.text());
      }
    });
  });

  test('02. Jobs listing (/jobs)', async ({ page }) => {
    const response = await page.goto('/jobs');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*jobs/);
  });

  test('03. Employers page (/employers)', async ({ page }) => {
    const response = await page.goto('/employers');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*employers/);
  });

  test('04. About page (/about)', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*about/);
  });

  test('05. Contact page (/contact)', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*contact/);
  });

  test('06. Pricing page (/pricing)', async ({ page }) => {
    const response = await page.goto('/pricing');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*pricing/);
  });

  test('07. FAQ page (/faq)', async ({ page }) => {
    const response = await page.goto('/faq');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*faq/);
  });

  test('08. How It Works page (/how-it-works)', async ({ page }) => {
    const response = await page.goto('/how-it-works');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*how-it-works/);
  });

  test('09. Resources page (/resources)', async ({ page }) => {
    const response = await page.goto('/resources');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*resources/);
  });

  test('10. Blog page (/blog)', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*blog/);
  });

  test('11. Skills Assessment Info (/skills-assessment)', async ({ page }) => {
    const response = await page.goto('/skills-assessment');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*skills-assessment/);
  });

  test('12. Claim Landing (/claim)', async ({ page }) => {
    const response = await page.goto('/claim');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*claim/);
  });

  test('13. AI/ML Jobs (/ai-ml-jobs)', async ({ page }) => {
    const response = await page.goto('/ai-ml-jobs');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*ai-ml-jobs/);
  });

  test('14. Healthcare IT Jobs (/healthcare-it-jobs)', async ({ page }) => {
    const response = await page.goto('/healthcare-it-jobs');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*healthcare-it-jobs/);
  });

  test('15. Fintech Jobs (/fintech-jobs)', async ({ page }) => {
    const response = await page.goto('/fintech-jobs');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*fintech-jobs/);
  });

  test('16. Cybersecurity Jobs (/cybersecurity-jobs)', async ({ page }) => {
    const response = await page.goto('/cybersecurity-jobs');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*cybersecurity-jobs/);
  });

  test('17. Terms page (/terms)', async ({ page }) => {
    const response = await page.goto('/terms');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*terms/);
  });

  test('18. Privacy page (/privacy)', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/.*privacy/);
  });
});
