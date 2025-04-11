const {test, expect, chromium} = require('@playwright/test');
const OrganizarionOrder = require('../pages/OrganizationOrder');
const userData = require('../utils/userData');

test.describe('Organization Order Page Tests', () => {
    let browser, context, page, order;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        order = new OrganizarionOrder(page);
        await order.navigate();
        await order.login(userData.admin.email, userData.admin.password);
        await order.changeRole('ADMIN');
        await page.waitForTimeout(500);
        await order.clickOnNavOrders();
        await page.waitForLoadState('domcontentloaded');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title and URL of Admin page', async () => {
        await expect(page).toHaveTitle('Organization Orders - Writing-Aide');
        await expect(page).toHaveURL('/organization/orders');
    })

    test('Verify organization credits', async () => {
        const creditText = await order.orgCredits.innerText();
        console.log('Org Credit Amount: ', creditText);
        expect(creditText).toMatch(/^\d+$/);
    })
   
    test('Verify Redeem Code button opens modal', async () => {      
        await order.redeemBtn.click();
        await expect(order.redeemTitle).toBeVisible();
        await expect(order.redeemCodeInput).toBeVisible();
        await expect(order.redeemSubmitBtn).toBeDisabled();
    })

    test('Verify Topup button opens modal', async () => {
        await order.topupBtn.click();
        await order.checkFixedCreditsButtonClickable();
    })

    test('Verify table headers are present and correctly labeled', async () => {
        await order.checkTableHeaders();
    })

    test('Verify orders are listed in descending order', async () => {
        await expect(page).toHaveURL('/organization/orders');
        await order.checkDateCells();
    })

    test('Verify status tags displaed correct text and color', async () => {
        await expect(page).toHaveURL('/organization/orders');
        await order.checkStatusCells();
    })
})