import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/')
  })

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/)
    await expect(page.locator('h1')).toContainText(/login/i)
  })

  test('should show validation error for empty credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('.error, [role="alert"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in invalid credentials
    await page.fill('input[name="username"], input[type="text"]', 'invalid_user')
    await page.fill('input[name="password"], input[type="password"]', 'wrong_password')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForSelector('.error, [role="alert"]', { timeout: 5000 })
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/)
  })

  test('should login successfully with valid admin credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in valid admin credentials
    await page.fill('input[name="username"], input[type="text"]', 'admin')
    await page.fill('input[name="password"], input[type="password"]', 'admin123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for navigation to admin dashboard
    await page.waitForURL(/.*\/admin/, { timeout: 10000 })
    
    // Should be on admin page
    await expect(page).toHaveURL(/.*\/admin/)
  })

  test('should login successfully with valid operator credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in valid operator credentials
    await page.fill('input[name="username"], input[type="text"]', 'operator1')
    await page.fill('input[name="password"], input[type="password"]', 'operator123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for navigation to admin dashboard
    await page.waitForURL(/.*\/admin/, { timeout: 10000 })
    
    // Should be on admin page
    await expect(page).toHaveURL(/.*\/admin/)
  })

  test('should persist session after page refresh', async ({ page }) => {
    await page.goto('/login')
    
    // Login
    await page.fill('input[name="username"], input[type="text"]', 'admin')
    await page.fill('input[name="password"], input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Wait for navigation
    await page.waitForURL(/.*\/admin/, { timeout: 10000 })
    
    // Refresh page
    await page.reload()
    
    // Should still be authenticated
    await expect(page).toHaveURL(/.*\/admin/)
    await expect(page).not.toHaveURL(/.*login/)
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="username"], input[type="text"]', 'admin')
    await page.fill('input[name="password"], input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/.*\/admin/, { timeout: 10000 })
    
    // Find and click logout button
    await page.click('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout-button"]')
    
    // Should redirect to login page
    await page.waitForURL(/.*login/, { timeout: 5000 })
    await expect(page).toHaveURL(/.*login/)
  })
})
