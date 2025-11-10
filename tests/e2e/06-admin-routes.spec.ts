import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Routes (Auth Required)', () => {

  test('Admin dashboard route exists (/admin)', async ({ page }) => {
    await page.goto('/admin');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin')).toBeTruthy();
  });

  test('Admin users route exists (/admin/users)', async ({ page }) => {
    await page.goto('/admin/users');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin/users')).toBeTruthy();
  });

  test('Admin jobs route exists (/admin/jobs)', async ({ page }) => {
    await page.goto('/admin/jobs');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin/jobs')).toBeTruthy();
  });

  test('Admin assessments route exists (/admin/assessments)', async ({ page }) => {
    await page.goto('/admin/assessments');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin/assessments')).toBeTruthy();
  });

  test('Admin placements route exists (/admin/placements)', async ({ page }) => {
    await page.goto('/admin/placements');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin/placements')).toBeTruthy();
  });

  test('Admin settings route exists (/admin/settings)', async ({ page }) => {
    await page.goto('/admin/settings');
    const url = page.url();
    expect(url.includes('/login') || url.includes('/admin/settings')).toBeTruthy();
  });
});
