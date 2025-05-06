const {test, expect, chromium} = require('@playwright/test');
const AdminPage = require('../pages/AdminPage');
const userData = require('../utils/userData');

test.describe('Admin Page Tests', () => {
    let browser, context, page, adminPage;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        adminPage = new AdminPage(page);
        await adminPage.navigate();
        adminPage.login(userData.admin.email, userData.admin.password);
        adminPage.changeRole('ADMIN');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/organization', {timeout: 10000});
    })

    test.afterEach(async () => {
        await page.close();
        await context.close();
    })

    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify title and URL of Admin page', async () => {
        await expect(page).toHaveTitle('My Organization - Writing-Aide');
    })

    test('Verify organization details', async () => {
        await expect(adminPage.orgName).toBeVisible();
        await expect(adminPage.orgDescription).toBeVisible();
        await expect(adminPage.orgCredit).toBeVisible({ timeout: 10000 });
        const creditValue = await adminPage.getOrgCreditAmount();
        await expect(creditValue).toBeGreaterThan(0);
        const reservedCreditValue = await adminPage.getReservedCreditAmount();
        await expect(reservedCreditValue).toBeGreaterThanOrEqual(0);
    })

    test('Verify that the user list displays correct user data', async () => {
        await expect(adminPage.userTable).toBeVisible();
        const userCount = await adminPage.userRows.count();
        console.log('Number of users: ', userCount);
        await expect(userCount).toBeGreaterThan(0);

        for (let i = 0; i < userCount; i++) {
            const row = adminPage.userRows.nth(i);
            const columns = await row.locator('td');
            // console.log('Number of columns in row ', i, ': ', await columns.count());
            await expect(columns).toHaveCount(9);
            await expect(columns.nth(0)).not.toBeEmpty();
            await expect(columns.nth(1)).not.toBeEmpty();
            await expect(columns.nth(2)).toContainText('@');
            await expect(columns.nth(3)).not.toBeEmpty();
        }
    })

    test('Verify search functionality', async () => {
        await expect(adminPage.searchInput).toBeVisible();
        const keyword = 'admin';
        await adminPage.searchInput.fill(keyword);
        await expect(adminPage.searchInput).toHaveValue(keyword);
        await page.waitForTimeout(500);
        const filteredRows = page.locator('tbody tr').filter({ hasText: keyword});
        const filteredCount = await filteredRows.count();
        console.log('Number of filtered rows: ', filteredCount);
        await expect(filteredCount).toBeGreaterThan(0);
    })

    test('Verify Add User button functionality', async () => {
        await expect(adminPage.addUserBtn).toBeVisible();
        await adminPage.addUserBtn.click();
        await expect(adminPage.userFormHeader).toBeVisible();
        await expect(adminPage.userFormName).toBeVisible();
        await expect(adminPage.userFormEmail).toBeVisible();
        await expect(adminPage.userFormClass).toBeVisible();
        await expect(adminPage.userFormRole).toBeVisible();
    });

    test('Verify Transfer Credit button functionality', async () => {
        await expect(adminPage.transferCreditBtn).toBeVisible();
        await adminPage.transferCreditBtn.click();
        await expect(adminPage.transferModal).toBeVisible();
        await expect(adminPage.transferHeader).toBeVisible();
        const srchInput = await adminPage.transferSrchInput;
        const keyword = 'Update';
        await srchInput.fill(keyword);
        await expect(srchInput).toHaveValue(keyword);
        await page.waitForTimeout(500);
        await expect(adminPage.transferAmountInput).toHaveValue('0');
        await expect(adminPage.transferCreditSubmitBtn).toBeDisabled();
        await adminPage.transferAmountInput.fill('100');
        await expect(adminPage.transferAmountInput).toHaveValue('100');
        await expect(adminPage.transferCreditSubmitBtn).toBeEnabled();
    })

    test('Verify the functionality of the submission links', async () => {
        const newTab = await adminPage.findAndClickMaxSubmittedWriting();
        await page.waitForTimeout(500);

        // Assert the URL of the new tab
        await expect(newTab).toHaveURL(/\/organization\/userwriting\/\d+/);
        // Assert the title of the new tab
        const header = await newTab.locator('main h2');
        await expect(header).toBeVisible();
        await expect(newTab).toHaveURL('/organization/userwriting/41');
        await newTab.close();
    })
})
