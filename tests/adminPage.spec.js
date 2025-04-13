const {test, expect, chromium} = require('@playwright/test');
const AdminPage = require('../pages/AdminPage');
const userData = require('../utils/userData');

test.describe('Admin Page Tests', () => {
    let browser, context, page, admin;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    })

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        admin = new AdminPage(page);
        await admin.navigate();
        admin.login(userData.admin.email, userData.admin.password);
        admin.changeRole('ADMIN');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('/organization');
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
        await expect(admin.orgName).toBeVisible();
        await expect(admin.orgDescription).toBeVisible();
        await expect(admin.orgCredit).toBeVisible({ timeout: 10000 });
        const creditValue = await admin.getOrgCreditAmount();
        await expect(creditValue).toBeGreaterThan(0);
        const reservedCreditValue = await admin.getReservedCreditAmount();
        await expect(reservedCreditValue).toBeGreaterThanOrEqual(0);
    })

    test('Verify that the user list displays correct user data', async () => {
        await expect(admin.userTable).toBeVisible();
        const userCount = await admin.userRows.count();
        console.log('Number of users: ', userCount);
        await expect(userCount).toBeGreaterThan(0);

        for (let i = 0; i < userCount; i++) {
            const row = admin.userRows.nth(i);
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
        await expect(admin.searchInput).toBeVisible();
        const keyword = 'admin';
        await admin.searchInput.fill(keyword);
        await expect(admin.searchInput).toHaveValue(keyword);
        await page.waitForTimeout(500);
        const filteredRows = page.locator('tbody tr').filter({ hasText: keyword});
        const filteredCount = await filteredRows.count();
        console.log('Number of filtered rows: ', filteredCount);
        await expect(filteredCount).toBeGreaterThan(0);
    })

    test('Verify Add User button functionality', async () => {
        await expect(admin.addUserBtn).toBeVisible();
        await admin.addUserBtn.click();
        await expect(admin.userFormHeader).toBeVisible();
        await expect(admin.userFormName).toBeVisible();
        await expect(admin.userFormEmail).toBeVisible();
        await expect(admin.userFormClass).toBeVisible();
        await expect(admin.userFormRole).toBeVisible();
    });

    test('Verify Transfer Credit button functionality', async () => {
        await expect(admin.transferCreditBtn).toBeVisible();
        await admin.transferCreditBtn.click();
        await expect(admin.transferModal).toBeVisible();
        await expect(admin.transferHeader).toBeVisible();
        const srchInput = await admin.transferSrchInput;
        const keyword = 'Update';
        await srchInput.fill(keyword);
        await expect(srchInput).toHaveValue(keyword);
        await page.waitForTimeout(500);
        await expect(admin.transferAmountInput).toHaveValue('0');
        await expect(admin.transferCreditSubmitBtn).toBeDisabled();
        await admin.transferAmountInput.fill('100');
        await expect(admin.transferAmountInput).toHaveValue('100');
        await expect(admin.transferCreditSubmitBtn).toBeEnabled();
    })

    test('Verify the functionality of the submission links', async () => {
        const newTab = await admin.findAndClickMaxSubmittedWriting();
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
