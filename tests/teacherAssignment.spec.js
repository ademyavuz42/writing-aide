const {test, expect, chromium} = require('@playwright/test');
const TeacherAssignment = require('../pages/TeacherAssignment');
const userData = require('../utils/userData');

test.describe('Task Assignments Page Tests', () => {
    let browser, context, page, taskPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        taskPage = new TeacherAssignment(page);
        await taskPage.navigate();
        await taskPage.login(userData.admin.email, userData.admin.password);
        await taskPage.changeRole('TEACHER');
        await taskPage.clickOnAssignment();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/teacher/assignments');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of organization credits page', async () => {
        await expect(page).toHaveTitle('Task Assignments - Writing-Aide');
    })

    test('Verify page loaded', async () => {
        await expect(taskPage.headingTitle).toBeVisible();
        await expect(taskPage.headers.id).toBeVisible();
        await expect(taskPage.headers.taskName).toBeVisible();
        await expect(taskPage.headers.deadline).toBeVisible();
        await expect(taskPage.headers.type).toBeVisible();
        await expect(taskPage.headers.status).toBeVisible();
        await expect(taskPage.headers.action).toBeVisible();
        const tableRowsCount = await taskPage.rows.count();
        console.log('Table rows count: ', tableRowsCount);
        await expect(tableRowsCount).toBeGreaterThan(0);
    })

    test('Verify "TYPE" column display correct values', async () => {
        const typeForId7 = await taskPage.getTypeByTaskId('7');
        expect(typeForId7).toBe('Class');
        const typeForId8 = await taskPage.getTypeByTaskId('8');
        expect(typeForId8).toBe('Student');
    })

    test('Verify Detail link navigates to correct page', async () => {
        const taskId = '7';
        await taskPage.clickDetailLinkByTaskId(taskId);
        await expect(page).toHaveURL(`/teacher/assignments/${taskId}`);
    })

    test('Verify Deadline date and time format', async () => {
        const deadlines = await taskPage.getAllDeadlines();
        console.log('Deadlines: ', deadlines);
        const deadlineRegex = /^[A-Za-z]+, \d{2} [A-Za-z]{3} \d{4}, \d{1,2}:\d{2} [AP]M$/;
        for (const deadline of deadlines) {
            expect(deadline).toMatch(deadlineRegex);
        }
    })

    test('Verify sorting of assignments by ID in descending order', async () => {
        const ids = await taskPage.getAllTaskIds();
        const sortedIds = [...ids].sort((a, b) => b - a);
        expect(ids).toEqual(sortedIds);
    })
});