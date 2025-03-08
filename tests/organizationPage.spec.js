const {test, expect, chromium} = require('@playwright/test');
const OraganizationPage = require('../pages/OrganizationPage');

test.describe('Teacher Page Tests', () => {
    let browser, context, page, admin;
    test.beforeAll(async()=>{
        browser = await chromium.launch({headless: true});
    })
    test.beforeEach(async()=>{
        context =await browser.newContext();
        page = await context.newPage();
        admin = new OraganizationPage(page);
        await admin.navigate();
    })
    test.afterEach(async()=>{
        await page.close();
        await context.close();
    })
    test.afterAll(async()=>{
        await browser.close();
    })
    test('Verify title and URL of Oraganization page', async()=>{
        await expect(page).toHaveURL('/organization-admin');
        await expect(page).toHaveTitle('Administrators - Writing-Aide');
    })
    test('Verify elements on Oraganization page', async()=>{
        await expect(admin.textTitle).toBeVisible();
        await expect(admin.video).toBeVisible();
        await expect(admin.signUpProcedure).toBeVisible();
        await expect(admin.writingTasks).toBeVisible();
        await expect(admin.registorOrganization).toBeVisible();
    })
})