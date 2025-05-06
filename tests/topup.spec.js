const {test, expect, chromium} = require('@playwright/test');
const {TopupPage, OrgTopupPage} = require('../pages/TopupPage');
const userData = require('../utils/userData');

test.describe.skip('Personal Credit Page Tests', () => {
    let browser, context, page, topupPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        topupPage = new TopupPage(page);
        await topupPage.navigate();
        await topupPage.login(userData.admin.email, userData.admin.password);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/dashboard');
        
        // Verify user role is ADMIN
        const userRole = await page.evaluate(() => window.localStorage.getItem('userRole'));
        expect(userRole).toBe('ADMIN'); // Adjust based on how the role is stored

        await topupPage.open();
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of topup page', async () => {
        await expect(page).toHaveTitle('Orders - Writing-Aide');
    })

    test('Verify bulk 7 button', async () => {
        await topupPage.selectBulk(7)
        await expect(topupPage.totalPrice).toContainText('$ 6,00')
        expect(await topupPage.getDiscountMessage()).toContain('You saved $ 1,00')
        await expect(topupPage.payNowBtn).toBeEnabled();
    })

    test('Verify the custom input disables discount', async () => {
        await topupPage.enterOtherAmount(11);
        await expect(topupPage.discountMessage).toHaveCount(0);
        await expect(topupPage.payNowBtn).toBeEnabled();
      });

      test('Verify the empty custom input blocks submission', async () => {
        await topupPage.otherAmountBtn.click();
        await topupPage.otherInput.fill('');
        await topupPage.payNowBtn.click({force: true});
        await expect(topupPage.payNowBtn).toBeDisabled();
      });

})

test.describe('Organizational Credit Page Tests', () => {
    let browser, context, page, orgTopupPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        orgTopupPage = new OrgTopupPage(page);
        await orgTopupPage.navigate();
        await orgTopupPage.login(userData.admin.email, userData.admin.password);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/dashboard');
        await orgTopupPage.open();
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of topup page', async () => {
        await expect(page).toHaveTitle('Organization Orders - Writing-Aide');
    })

    test('Verify bulk 5000 button', async () => {
        await orgTopupPage.selectBulk(5000)
        await expect(orgTopupPage.totalPrice).toContainText('$ 2625,00')
        expect(await orgTopupPage.getDiscountMessage()).toContain('You saved $ 2375,00')
        await expect(orgTopupPage.payNowBtn).toBeEnabled();
    })

    test.only('Verify the custom input disables discount', async () => {
        await orgTopupPage.enterOtherAmount(11000);
        await expect(orgTopupPage.discountMessage).toHaveCount(0);
        await expect(orgTopupPage.payNowBtn).toBeEnabled();
      });

      test('Verify the empty custom input blocks submission', async () => {
        await orgTopupPage.otherAmountBtn.click();
        await orgTopupPage.otherInput.fill('');
        await orgTopupPage.payNowBtn.click({force: true});
        await expect(orgTopupPage.payNowBtn).toBeDisabled();
      });

})