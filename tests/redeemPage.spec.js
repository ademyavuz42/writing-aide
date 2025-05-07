const {test, expect, chromium} = require('@playwright/test');
const RedeemPage = require('../pages/RedeemPage');
const userData = require('../utils/userData');
 

test.describe('Redeem Code Modal Tests', () => {
    let browser, context, page, redeemModal;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        redeemModal = new RedeemPage(page);
        await redeemModal.navigate();
        await redeemModal.login(userData.admin.email, userData.admin.password);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/dashboard');
        await redeemModal.openModal();
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify modal can open and close', async () => {
        await expect(redeemModal.modal).toBeVisible();
        await redeemModal.closeModal();
        await expect(redeemModal.modal).toBeHidden();
    })

    test('Verify the redeem button is disabled when input is empty', async () => {
        await redeemModal.enterCode('');
        const disabled = await redeemModal.isRedeemDisabled();
        expect(disabled).toBe(true);
    })

    test('Verify error is shown for invalid code', async () => {
        await redeemModal.enterCode('InvalidPrice');
        const isErrorVisible = await redeemModal.isErrorIconVisible();
        expect(isErrorVisible).toBe(true);
    })

    test('Verify success is shown for valid code', async () => {
        await redeemModal.enterCode('TestPersonal');
        const isSuccessVisible = await redeemModal.isSuccessIconVisible();
        console.log(isSuccessVisible)
        expect(isSuccessVisible).toBe(true);
    })
})