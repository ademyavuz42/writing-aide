const {test, expect, chromium} = require('@playwright/test');
const AssignmentDetailPage = require('../pages/AssignmentDetailPage');
const userData = require('../utils/userData');

test.describe('Writing Details Page Tests', () => {
    let browser, context, page, writingPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        writingPage = new AssignmentDetailPage(page);
        await writingPage.navigate();
        await writingPage.login(userData.student.email, userData.student.password);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/dashboard');
        await writingPage.clickDetailLink();
        await expect(page).toHaveURL('/writing/show/115');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of writing details page', async () => {
        await expect(page).toHaveTitle('Writing Details - Writing-Aide');
    })

    test('Verify the writing details page loads correctly' , async () => {
        await writingPage.verifyAllSectionsVisible();  
    })

    test('Verify the instruction and question text correctness', async () => {
        await writingPage.verifyInstructionText();
        await writingPage.verifyQuestionText();
    })

    test('Verify student writing response is displayed', async () => {
       await writingPage.verifyStudentResponseVisibleAndValid();
    })

    test('Verify that score, word count, and complition time are displayed correctly', async () => {
       await writingPage.verifyScoreWordCountAndTime();
    })

    test('Verify AI generated response content displayed', async () => {
        await writingPage.verifySuggestedResponse();
    })

    test('Verify functionality of transformed writing', async () => {
        await writingPage.editTransformedWriting();
    })
})