const {test, expect, chromium} = require('@playwright/test');
const OrganizationCredit = require('../pages/OrganizationCredit');
const userData = require('../utils/userData');

test.describe('Organization Credit Page Tests', () => {
    let browser, context, page, credit;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        credit = new OrganizationCredit(page);
        await credit.navigate();
        await credit.login(userData.admin.email, userData.admin.password);
        await credit.changeRole('ADMIN');
        await credit.clickOnNavCredit();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/organization/credits');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of organization credits page', async () => {
        await expect(page).toHaveTitle('Credits - Writing-Aide');
    })

    test('Verify header text of organization credits page', async () => {
        await expect(credit.headerText).toBeVisible();
    })

    test('Verify table headers are present and correctly labeled', async () => {
        await credit.checkTableHeaders();
    })

    test('Verify amount cells are colored correctly', async () => {
        await credit.checkAmountCells();
    })

    test('Verify total credit calculation matches current balance', async () => {
        await credit.calculateTotalCredit();
    })

    test.skip('Verify that credits are correctly added after each transaction', async () => {
        await credit.checkBalncedCells();
    })
})