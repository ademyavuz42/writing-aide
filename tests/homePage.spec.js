const { test, expect, chromium } = require('@playwright/test');
const HomePage = require('../pages/HomePage');

test.describe('Home Page Tests', () => {
    let browser, context, page, homePage;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
    });

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        homePage = new HomePage(page);
        await homePage.navigate();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test('Verify title and URL of Landing page', async () => {
        await expect(page).toHaveURL('https://writing-aide.zerone.id/');
        await expect(page).toHaveTitle('Home - Writing-Aide');
    });

    test('Logo should be visible and clickable', async () => {
        await expect(homePage.logo).toBeVisible();
        await homePage.clickElement(homePage.logo);
        await expect(page).toHaveURL(/.*\//);
    });

    test('Clicking login navigates to login page', async () => {
        await homePage.clickElement(homePage.loginButton);
        await expect(page).toHaveURL(/.*\/login/);
    });

    test('Clicking sign up navigates to register page', async () => {
        await homePage.clickElement(homePage.signUpButton);
        await expect(page).toHaveURL(/.*\//);
    });

    test('Login and Sign Up buttons should have correct text', async () => {
        await expect(homePage.loginButton).toHaveText('Login');
        await expect(homePage.signUpButton).toHaveText('Sign Up');
    });

    test('Navigation links should be clickable', async () => {
        await homePage.clickElement(homePage.navigationButton);
        const navLinks = [
            { link: homePage.homeLink, url: /.*\// },
            { link: homePage.testTakerLink, url: /.*\/test-taker/ },
            { link: homePage.teacherLink, url: /.*\/teacher/ },
            { link: homePage.organizationLink, url: /.*\/organization-admin/ },
            { link: homePage.writingTipsLink, url: /.*\/writing-tips/ },
            { link: homePage.aboutUsLink, url: /.*\/about-us/ }
        ];

      
        for (const { link, url } of navLinks) {
            await homePage.clickElement(link);
            await expect(page).toHaveURL(url);
            await homePage.navigate();
            await homePage.clickElement(homePage.navigationButton);
        }
    });

    test('Verify video thumbnail visibility', async () => {
        await expect(homePage.video).toBeVisible();
    });

    test('Verify the visibility of left panel', async () => {
        expect(await homePage.isElementVisible(homePage.leftPanel)).toBeDefined()
    });

    test('Left panel links navigation', async () => {
        const panelLinks = [
            { link: homePage.testTakersMain, url: /.*\/test-taker/ },
            { link: homePage.teachersMain, url: /.*\/teacher/ },
            { link: homePage.organizationMain, url: /.*\/organization-admin/ }
        ];

        for (const { link, url } of panelLinks) {
            await homePage.clickElement(link);
            await expect(page).toHaveURL(url);
            await homePage.navigate();
        }
    });

    test('Verify the page header text', async () => {
        await expect(homePage.titlePage).toHaveText('Writing Companion');
    });

    test('Writing tips links navigation', async () => {
        const tipsLinks = ['IELTS', 'TOEFL', 'GCSE', 'Custom Test'];
        
        for (const linkText of tipsLinks) {
            const link = await homePage.getElementByRole('link', linkText);
            await link.click();
            await expect(page).toHaveURL(`https://writing-aide.zerone.id/writing-tips?openAccordion=${linkText}`);
            await page.goBack();
        }
    });
});
