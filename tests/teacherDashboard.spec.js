const { test, expect, chromium } = require('@playwright/test');
const TeacherDashBoard = require('../pages/TeacherDashboard');
const userData = require('../utils/userData');

test.describe('Teacher Dashboard Page Tests', () => {
    let browser, context, page, teacher;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: false });
    })

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        teacher = new TeacherDashBoard(page);
        await teacher.navigate();
        await teacher.login(userData.teacher.email, userData.teacher.password);
        await teacher.changeRole('TEACHER');
    })

    test.afterEach(async () => {
        await page.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title and URL of Dashboard page', async () => { 
        await expect(page).toHaveTitle("Teacher's Dashboard - Writing-Aide");
        await expect(page).toHaveURL('/teacher/dashboard');
    });

    test('Verify the welcome message', async () => {
        const welcomeMessage = await teacher.getWelcomeText();
        await expect(welcomeMessage).toContain('Welcome, ');
    });

    test('Verify Task Assigment Heading visibility', async () => {
        await expect(teacher.headingTaskAssignment).toBeVisible();
    })

    test('Verify Assign Task Button Functionality', async () => {
        await teacher.assignTaskButton.click();
        await expect(page.locator('section header p')).toHaveText('Assign Task');
        await expect(page.getByPlaceholder('Enter Task Name')).toBeVisible();
        await expect(page.locator('#assignTask-SelectAssignTo-Class')).toBeVisible();
        await expect(page.locator('#assignTask-SelectAssignTo-Personal')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Next'})).toBeVisible();
    })

    test('Verify Classes card visibility', async () => {
            await expect(teacher.classCard).toBeVisible();
            await expect(teacher.studentsCard).toBeVisible();
            await expect(teacher.testsCard).toBeVisible();
    })

    test('Verify Classes card title display', async () => {
    await expect(page.getByText('10A-Test')).toBeVisible();
    await page.locator('div').filter({ hasText: /^Class$/ }).getByRole('button').click();
    await expect(page.getByText('10B-Test')).toBeVisible();
    })

    test('Verify Test Type and Score visibility', async () => {
        await expect(page.getByText('Custom Test')).toBeVisible();
        await expect(page.getByText('Average Score').first()).toBeVisible();
        await expect(page.getByText('Standardized Test')).toBeVisible();
        await expect(page.getByText('Average Score').nth(1)).toBeVisible();
    })

    test('Verify Test Type and Score display and functionality', async () => {
        const menu = await page.locator('div').filter({ hasText: /^Custom Test$/ }).getByRole('textbox');
        await menu.click();
        await page.getByText('Developing ESL').click();
        await expect(page.getByText('90')).toBeVisible();
        await menu.click();
        await page.getByText('Skilled ESL').click();
        await expect(page.getByText('95')).toBeVisible();
        await menu.click();
        await page.getByText('Budding ESL').click();
        await expect(page.getByText('85')).toBeVisible();
    })

})