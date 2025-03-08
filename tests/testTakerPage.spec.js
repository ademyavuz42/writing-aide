const {test, expect, chromium} = require('@playwright/test');
const TestTakerPage = require('../pages/TestTakerPage');

test.describe('Test Taker Page Tests', () => {
    let browser, context, page, testTaker;
    test.beforeAll(async()=>{
        browser = await chromium.launch({headless: true});
    })
    test.beforeEach(async()=>{
        context =await browser.newContext();
        page = await context.newPage();
        testTaker = new TestTakerPage(page);
        await testTaker.navigate();
    })
    test.afterEach(async()=>{
        await page.close();
        await context.close();
    })
    test.afterAll(async()=>{
        await browser.close();
    })
    test('Verify title and URL of Test Taker page', async()=>{
        await expect(page).toHaveURL('/test-taker');
        await expect(page).toHaveTitle('Test Takers - Writing-Aide');
    })
    test('Verify elements on Test Taker page', async()=>{
        await expect(testTaker.textTitle).toBeVisible();
        await expect(testTaker.video).toBeVisible();
        await expect(testTaker.howToUse).toBeVisible();
        await expect(testTaker.improveWriting).toBeVisible();
        await expect(testTaker.score).toBeVisible();
        await expect(testTaker.feedBack).toBeVisible();
        await expect(testTaker.transform).toBeVisible();
        await expect(testTaker.suggestion).toBeVisible();
        await expect(testTaker.compare).toBeVisible();
        await expect(testTaker.contactUs).toBeVisible();
        await expect(testTaker.loginheaderSection).toBeVisible();
        await expect(testTaker.loginNavSection).not.toBeVisible();
    })
})