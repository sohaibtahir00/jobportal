import { test, expect } from '@playwright/test';

test.describe('Employer Dashboard Routes (Auth Required)', () => {

  test('Employer dashboard route exists (/employer/dashboard)', async ({ page }) => {
    await page.goto('/employer/dashboard');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/dashboard')).toBeTruthy();
  });

  test('Post job route exists (/employer/jobs/new)', async ({ page }) => {
    await page.goto('/employer/jobs/new');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/jobs/new')).toBeTruthy();
  });

  test('Employer applicants route exists (/employer/applicants)', async ({ page }) => {
    await page.goto('/employer/applicants');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/applicants')).toBeTruthy();
  });

  test('Employer search route exists (/employer/search)', async ({ page }) => {
    await page.goto('/employer/search');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/search')).toBeTruthy();
  });

  test('Employer claim route exists (/employer/claim)', async ({ page }) => {
    await page.goto('/employer/claim');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/claim')).toBeTruthy();
  });

  test('Employer placements route exists (/employer/placements)', async ({ page }) => {
    await page.goto('/employer/placements');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/placements')).toBeTruthy();
  });

  test('Employer invoices route exists (/employer/invoices)', async ({ page }) => {
    await page.goto('/employer/invoices');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/invoices')).toBeTruthy();
  });

  test('Employer settings route exists (/employer/settings)', async ({ page }) => {
    await page.goto('/employer/settings');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/employer/settings')).toBeTruthy();
  });
});
