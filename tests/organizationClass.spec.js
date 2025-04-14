const {test, expect, chromium} = require('@playwright/test');
const OrganizationClass = require('../pages/OrganizationClass');
const userData = require('../utils/userData');

test.describe('Organization Credit Page Tests', () => {
    let browser, context, page, classPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context =await browser.newContext();
        page = await context.newPage();
        classPage = new OrganizationClass(page);
        await classPage.navigate();
        await classPage.login(userData.admin.email, userData.admin.password);
        await classPage.changeRole('ADMIN');
        await classPage.clickOnNavClass();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/organization/class');
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title of organization credits page', async () => {
        await expect(page).toHaveTitle('Class Management - Writing-Aide');
    })

    test('Verify the functionality of creating a class', async () => {
        const countBefore = await classPage.getClassRowsCount();
        console.log('Class count before creation: ', countBefore);
        const className = 'Test Class';
        await classPage.createClass(className);
        await page.waitForTimeout(2000);
        const countAfter = await classPage.getClassRowsCount();
        console.log('Class count after creation: ', countAfter);
        expect(countAfter).toBeGreaterThan(countBefore);
        const lastClassCode = await classPage.getLastClassCode();
        console.log('Last class code: ', lastClassCode);
        expect(lastClassCode).toMatch(/^[a-zA-Z0-9]{7}$/);
        await classPage.deleteClassName(className);
        await page.waitForTimeout(3000);
        const countAfterDelete = await classPage.getClassRowsCount();
        expect(countAfterDelete).toBe(countBefore);
    })

    test('Verify the empty state of input field', async () => {
        expect(classPage.classNameInput).toBeEmpty();
        await classPage.createClass('');
       const message = await classPage.getValidationMessage();
       expect(message).toBe('Please fill out this field.');
    })

    test('Verify uniqueness of class code', async () => {
        const baseName = 'Test Class - ';
        const classNames = ['A', 'B'].map((suffix) => `${baseName}${suffix}`);

        // await page.goto('/organization/class');

        const initialCodes = await classPage.getAllClassCodes();
        console.log('Initial class codes: ', initialCodes);

        for (const name of classNames) {
            await classPage.createClass(name);
            await page.waitForTimeout(1000);
        }

        const finalCodes = await classPage.getAllClassCodes();
        console.log('Final class codes: ', finalCodes);
        const newCodes = finalCodes.slice(-classNames.length);
        console.log('New class codes: ', newCodes);


        for (const code of newCodes) {
            expect(code).toMatch(/^[a-z0-9]{7}$/);
        }

        const uniqueSet = new Set(newCodes);
        expect(uniqueSet.size).toBe(newCodes.length);

        // Delete the created classes
        for (const name of classNames) {
            await classPage.deleteClassName(name);
            await page.waitForTimeout(1000);
        }
    })

    test('Verify the total classes count mathes number of rows', async () => {
        const uiTotalCount = await classPage.getTotalClassCount();
        const tableRowCount = await classPage.getClassRowsCount();
        expect(uiTotalCount).toBe(parseInt(tableRowCount));
    })

    test('Verify the functionality of editing a class', async () => {
        const originalName = '10D-Test';
        const updatedName = '10D-Test-Updated';

       // 1. Create the initial class
       await classPage.createClass(originalName);
       // Wait specifically for the created row to appear
       const originalRowLocator = classPage.classTableRows.filter({ hasText: originalName });
       await expect(originalRowLocator, `Row with original name "${originalName}" should appear after creation`).toBeVisible({ timeout: 10000 });

       // 2. Edit the class name
       await classPage.editClassName(originalName, updatedName);

        // 3. Wait for the change to be reflected reliably
        const updatedRowLocator = classPage.classTableRows.filter({ hasText: updatedName });
        await expect(updatedRowLocator, `Row with updated name "${updatedName}" should appear after edit`).toBeVisible({ timeout: 10000 });

        // 4. Verify existence using the (now fixed) function
        const exists = await classPage.classNameExists(updatedName);
        expect(exists, `classNameExists should return true for "${updatedName}" after edit`).toBe(true);

        // --- Post-cleanup ---
        await classPage.deleteClassName(updatedName);
        // Verify deletion
        await expect(updatedRowLocator, `Row with updated name "${updatedName}" should disappear after deletion`).not.toBeVisible({ timeout: 10000 });
    })
});