const {test, expect, chromium} = require('@playwright/test');
const TaecherAssignmentDetails = require('../pages/TeacherAssignmentDetails');
const userData = require('../utils/userData');

test.describe('Task Assignments Details Page Tests', () => {
    let browser, context, page, taskPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        taskPage = new TaecherAssignmentDetails(page);
        await taskPage.navigate();
        await taskPage.login(userData.admin.email, userData.admin.password);
        await taskPage.changeRole('TEACHER');
        await taskPage.clickOnAssignment();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/teacher/assignments');
        const taskId = '13';
        await taskPage.clickDetailLinkByTaskId(taskId);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(`/teacher/assignments/${taskId}`);
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of teacher assignment details page', async () => {
        await expect(page).toHaveTitle('Assignment Details - Writing-Aide');
    })

    test('Verify the "Back" button functionality', async () => {
        await expect(taskPage.backBtn).toBeVisible();
        await taskPage.backBtn.click();
        await expect(page).toHaveURL('/teacher/assignments');
    })

    test('Verify the "Assignments" link functionality', async () => {
        await expect(taskPage.assinmentsLink).toBeVisible();
        await taskPage.assinmentsLink.click();
        await expect(page).toHaveURL('/teacher/assignments');
    })

    test('Verify the heading title on the assignment details page', async () => {
        await expect(taskPage.headingTitle).toBeVisible();
    })

    test('Verify the creation date and deadline should be in "Day, DD Month YYYY" format', async () => {
        const creationText = await taskPage.creationDate.textContent();
        const deadlineText = await taskPage.deadlineDate.textContent();
        const dateFormat = /^[A-Za-z]+, \d{1,2} [A-Za-z]+ \d{4}$/;
        expect(creationText).toMatch(dateFormat);
        expect(deadlineText).toMatch(dateFormat);
    })

    test('Verify the writing task type is displayed', async () => {
        await expect(taskPage.writingExamType).toBeVisible();
    })

    test('Verify that the status is shown as ENDED when the deadline has passed', async () => {
        const statusText = await taskPage.status.textContent();
        await expect(statusText).toContain('Ended');
    })

    test('Verify the total recipients and submitted users are displayed', async () => {
        await expect(taskPage.totalRecipients).toBeVisible();
        await expect(taskPage.submittedUsers).toBeVisible();
    })

    test('Verify user list shows correct details', async () => {
        const tableRow = page.locator('tbody tr').nth(0);
        const cells = tableRow.locator('td');
        await expect(cells).toHaveCount(6);
        await expect(cells.nth(0)).toContainText('41');
        await expect(cells.nth(1)).toContainText('Student Update');
        await expect(cells.nth(2)).toContainText('Submitted');
        await expect(cells.nth(4)).toContainText('2 : 6');
        await expect(cells.nth(5)).toContainText('95 out of 100');
    })

    test('Verify the score is a clickable link', async () => {
        const scoreLink = page.locator('tbody tr td:nth-child(6) a');
        await expect(scoreLink).toBeVisible();
        await scoreLink.click();
        await expect(page).toHaveURL(/writing\/show\/\d+/); 
    })

    test('Verify the functionality of the Modify button', async () => {
        await expect(taskPage.modifyBtn).toBeVisible();
        await taskPage.modifyBtn.click();
        await expect(taskPage.formInModal).toBeVisible();
    })


})