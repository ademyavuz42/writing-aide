const {test, expect, chromium} = require('@playwright/test');
const WritingPage = require('../pages/WritingPage');
const userData = require('../utils/userData');
const exp = require('constants');

test.describe('Writing Page Tests', () => {
    let browser, context, page, writingPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        writingPage = new WritingPage(page);
        await writingPage.navigate();
        await writingPage.login(userData.student.email, userData.student.password);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/dashboard');
        await writingPage.writingsLink.click();
        await expect(page).toHaveURL('/writing');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of writing page', async () => {
        await expect(page).toHaveTitle('My Writings - Writing-Aide');
    })

    test('Verify writing page loads successfully', async () => {
        await writingPage.verifyMainComponentsVisible();
        await writingPage.verifyWritingComponentsVisible();
    })

    test('Verify Start New Writing btn functionality', async () => {
        await writingPage.verifyStartNewWritingBtn();
        await expect(page).toHaveURL('/writing/start');
    })

    test('Verify Sort by Date button functionality', async () => {
        const datesBeforeSort = await writingPage.getWritingDates();
        // console.log('Dates Before Sort:', datesBeforeSort)
        await writingPage.clickSortByDate();
        await page.waitForTimeout(1000);
        const datesAfterSort = await writingPage.getWritingDates();
        // console.log('Dates After Sort:', datesAfterSort)
       const sortedDates = [...datesAfterSort].sort((a,b) => a - b);
    //    console.log('Sorted Dates:', sortedDates)
       expect(datesAfterSort).toEqual(sortedDates);
    })

    test('Verify each writing entry shows required fields', async () => {
       await writingPage.verifyEachWritingEntry();
    })

    test('Verify detail button is clickable', async () => {
       await writingPage.verifyEachDetailButtonClickable();
    })

    test('Verify clicking detail button navigates to correct page', async () => {
       await writingPage.clickDetailButtonAndVerifyRedirection(0);
    })

    test('Verify clicking delete button trigger confirmation popup', async () => {
       await writingPage.clickDeleteButtonAndVerifyPopup();
    })

  
})