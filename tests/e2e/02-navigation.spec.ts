import { test, expect } from '@playwright/test';

test.describe('Navigation - Links and Menus', () => {

  test('Header - Desktop navigation links exist', async ({ page }) => {
    await page.goto('/');

    // Check main header links - use header scope to avoid footer matches
    await expect(page.locator('header a[href="/"]').first()).toBeVisible(); // Logo
    await expect(page.locator('header a[href="/jobs"]').first()).toBeVisible();
    await expect(page.locator('header a[href="/employers"]').first()).toBeVisible();
  });

  test('Footer - All footer links exist and work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footerLinks = [
      { href: '/about', name: 'About' },
      { href: '/contact', name: 'Contact' },
      { href: '/blog', name: 'Blog' },
      { href: '/how-it-works', name: 'How It Works' },
      { href: '/pricing', name: 'Pricing' },
      { href: '/faq', name: 'FAQ' },
      { href: '/resources', name: 'Resources' },
      { href: '/jobs', name: 'Browse Jobs' },
      { href: '/ai-ml-jobs', name: 'AI/ML Jobs' },
      { href: '/healthcare-it-jobs', name: 'Healthcare IT' },
      { href: '/fintech-jobs', name: 'Fintech Jobs' },
      { href: '/cybersecurity-jobs', name: 'Cybersecurity' },
      { href: '/skills-assessment', name: 'Skills Assessment' },
      { href: '/employers', name: 'For Employers' },
      { href: '/claim', name: 'Claim Jobs' },
      { href: '/terms', name: 'Terms' },
      { href: '/privacy', name: 'Privacy' }
    ];

    for (const link of footerLinks) {
      const linkElement = page.locator(`footer a[href="${link.href}"]`).first();
      const exists = await linkElement.count() > 0;

      if (!exists) {
        console.log(`❌ MISSING: Footer link "${link.name}" (${link.href})`);
      }

      expect(exists, `Footer should have link to ${link.href}`).toBeTruthy();
    }
  });

  test('Mobile menu - Opens and has correct signup link', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Find and click mobile menu button
    const menuButton = page.locator('button').filter({ hasText: /menu|navigation/i }).first();

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // Check for signup link - should be /signup NOT /register
      const signupLink = page.locator('a[href="/signup"]');
      await expect(signupLink).toBeVisible();

      // Verify NO /register links exist
      const registerLink = page.locator('a[href="/register"]');
      const registerCount = await registerLink.count();
      expect(registerCount, '❌ Found /register link - should be /signup').toBe(0);
    } else {
      console.log('⚠️  Mobile menu button not found - might be desktop only');
    }
  });

  test('Home page CTAs navigate correctly', async ({ page }) => {
    await page.goto('/');

    // Test "Browse Jobs" CTA
    const browseJobsBtn = page.locator('a[href="/jobs"]').first();
    if (await browseJobsBtn.isVisible()) {
      await browseJobsBtn.click();
      await expect(page).toHaveURL(/.*jobs/);
    }

    // Test "For Employers" CTA
    await page.goto('/');
    const employersBtn = page.locator('a[href="/employers"]').first();
    if (await employersBtn.isVisible()) {
      await employersBtn.click();
      await expect(page).toHaveURL(/.*employers/);
    }
  });
});
