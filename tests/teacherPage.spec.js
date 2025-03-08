const {test, expect, chromium} = require('@playwright/test');
const TeacherPage = require('../pages/TeacherPage');

test.describe('Teacher Page Tests', () => {
    let browser, context, page, teacher;
    test.beforeAll(async()=>{
        browser = await chromium.launch({headless: true});
    })
    test.beforeEach(async()=>{
        context =await browser.newContext();
        page = await context.newPage();
        teacher = new TeacherPage(page);
        await teacher.navigate();
    })
    test.afterEach(async()=>{
        await page.close();
        await context.close();
    })
    test.afterAll(async()=>{
        await browser.close();
    })
    test('Verify title and URL of Teacher page', async()=>{
        await expect(page).toHaveURL('/teacher');
        await expect(page).toHaveTitle('Teachers - Writing-Aide');
    })
    test('Verify elements on Teacher page', async()=>{
        await expect(teacher.textTitle).toBeVisible();
        await expect(teacher.video).toBeVisible();
        await expect(teacher.signUpProcedure).toBeVisible();
        await expect(teacher.writingTasks).toBeVisible();
        await expect(teacher.testTitleTryOurAI).toBeVisible();
        await expect(teacher.registorOrganization).toBeVisible();
        await expect(teacher.tryForFree).toBeVisible();
    })
})