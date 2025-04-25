const {test, expect, chromium} = require('@playwright/test');
const WritingStartPage = require('../pages/WritingStartPage');
const userData = require('../utils/userData');

test.describe('Writing Start Page Tests', () => {
    let browser, context, page, startWriting;
    const examNames = ['ielts', 'toefl', 'gcseAqa', 'gcseEdexcel', 'gcseOcr'];


    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        startWriting = new WritingStartPage(page);
        await startWriting.navigate();
        await startWriting.login(userData.student.email, userData.student.password);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/dashboard');
        await startWriting.getStartedBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/writing/start');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of writing page', async () => {
        await expect(page).toHaveTitle('Start Writing - Writing-Aide');
    })

    test('Verify UI elements on start writing page', async () => {
        await startWriting.verifyInitialUIElements();
    })
    test('Verify default state of the page', async () => {
        await startWriting.noTaskDescriptionAndDisabledSubmit();
    })

        for (const exam of examNames) {
    test(`Click "${exam.toUpperCase()}" and verify it becomes active`, async () => {
        await startWriting.clickExamButton(exam);
        await startWriting.activeExamButton(exam);
        await expect(page.locator('.m_e615b15f > div:nth-child(5)')).toBeVisible();
    })
}
    test('Verify task1 button activation', async () => {
        await startWriting.clickTaskButton('task1');
        await startWriting.activeTaskButton('task1');
        const descTask1 = await startWriting.getTaskDescription();
        expect(descTask1).toContain('Information Transfer')
        await expect(startWriting.submitBtn).toBeEnabled();
        await startWriting.clickTaskButton('task2');
        await startWriting.activeTaskButton('task2');
        const descTask2 = await startWriting.getTaskDescription();
        expect(descTask2).toContain('Opinion')
        await expect(startWriting.submitBtn).toBeEnabled();
    })

    test('Switch exam after selecting task', async () => {
        await startWriting.clickExamButton('ielts');
        const taskLabelsIELTS = await startWriting.getAllTaskLabels();
        const task1LabelIELTS = taskLabelsIELTS.task1;

        await startWriting.clickTaskButton('task1');
        const descIELTS = await startWriting.getTaskDescription();

        await startWriting.clickExamButton('toefl');
        const taskLabelsTOEFL = await startWriting.getAllTaskLabels();
        const task1LabelTOEFL = taskLabelsTOEFL.integrated;
        await startWriting.clickTaskButton('integrated');
        const descTOEFL = await startWriting.getTaskDescription();

        expect(task1LabelIELTS).not.toEqual(task1LabelTOEFL);
        expect(descIELTS?.trim()).not.toEqual(descTOEFL?.trim());

        console.log('IELTS Task 1 label: ', task1LabelIELTS);
        console.log('TOEFL Task 1 label: ', task1LabelTOEFL);
    })

    test('Verify confirmation of Submit Button Action', async () => {
        await startWriting.clickExamButton('toefl');
        await startWriting.clickTaskButton('integrated');
        await startWriting.submitBtn.click();
        await expect(page).toHaveURL(/\/writing\/question\/\d+$/);
    })

   

});