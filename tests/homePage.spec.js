import { test, expect, chromium } from '@playwright/test'
const HomePage = require('../pages/HomePage')

test.describe('Home Page HeaderSection Test', () => {
    let browser;
    let page;
    let homePage;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: false })
    })

    test.beforeEach(async () => {
        const context = await browser.newContext()
        page = await context.newPage()
        homePage = new HomePage(page)
        await homePage.navigate()

    })
    test.afterEach(async () => {
        await page.close()
    })
    test.afterAll(async () => {
        await browser.close()
    })

    test('Verify title and URL of Landing page', async () => {
        await expect(homePage.getUrl()).resolves.toBe('https://writing-aide.zerone.id/')
        await expect(homePage.getTitle()).resolves.toBe('Home - Writing-Aide')
    })

    test('Logo should be visible', async () => {
        expect(await homePage.isElementVisible(homePage.logo)).toBeTruthy()
    })

    test('Clicking login navigates to login page', async () => {
        await homePage.clickElement(homePage.loginButton)
        await expect(page).toHaveURL(/.*\/login/)
    })

    test('Clicking sign up navigates to register page', async () => {
        await homePage.clickElement(homePage.loginButton)
        await expect(page).toHaveURL(/.*\//)
    })

    test('Logo should be clickable', async () => {
        await homePage.clickElement(homePage.logo)
        await expect(page).toHaveURL(/.*\//)
    })

    test('Login and Sign up should have correct text', async () => {
        await expect(homePage.loginButton).toHaveText('Login')
        await expect(homePage.signUpButton).toHaveText('Sign Up')
    })

    test('Home link is clickable', async () => {
        await homePage.clickElement(homePage.navigationButton)

    })

})
test.describe('Home Page NavBar Test', () => {
    let browser;
    let page;
    let homePage;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: false })
    })

    test.beforeEach(async () => {
        const context = await browser.newContext()
        page = await context.newPage()
        homePage = new HomePage(page)

        await homePage.navigate()
        await homePage.clickElement(homePage.navigationButton)

    })
    test.afterEach(async () => {
        await page.close()
    })

    test.afterAll(async () => {
        await browser.close()
    })


    test('Home link is clickable', async () => {
        await homePage.clickElement(homePage.homeLink)
        await expect(page).toHaveURL(/.*\//)
    })

    test('Test Taker link is clickable', async () => {
        await homePage.clickElement(homePage.testTakerLink)
        await expect(page).toHaveURL(/.*\/test-taker/)
    })

    test('Teacher link is clickable', async () => {
        await homePage.clickElement(homePage.teacherLink)
        await expect(page).toHaveURL(/.*\/teacher/)
    })

    test('Organization link is clickable', async () => {
        await homePage.clickElement(homePage.organizationLink)
        await expect(page).toHaveURL(/.*\/organization-admin/)
    })

    test('Writing Tips link is clickable', async () => {
        await homePage.clickElement(homePage.writingTipsLink)
        await expect(page).toHaveURL(/.*\/writing-tips/)
    })

    test('About us link is clickable', async () => {
        await homePage.clickElement(homePage.aboutUsLink)
        await expect(page).toHaveURL(/.*\/about-us/)
    })




})


test.describe('Home Page Main Section Test', () => {
    let browser;
    let page;
    let homePage;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: false })
    })

    test.beforeEach(async () => {
        const context = await browser.newContext()
        page = await context.newPage()
        homePage = new HomePage(page)

        await homePage.navigate()
    })
    test.afterEach(async () => {
        await page.close()
    })

    test.afterAll(async () => {
        await browser.close()
    })

    test('Verify the visibility of Video thumbnail ', async () => {
        expect(await homePage.isElementVisible(homePage.video)).toBeTruthy()
    })

    test('Verify the visibility of left panel', async () => {
        expect(await homePage.isElementVisible(homePage.leftPanel)).toBeDefined()
    })

    test('Navigate to Test Takers page from left panel', async () => {
        await homePage.clickElement(homePage.testTakersMain)
        await expect(page).toHaveURL(/.*\/test-taker/)
    })

    test('Navigate to Teachers page from left panel', async () => {
        await homePage.clickElement(homePage.teachersMain)
        await expect(page).toHaveURL(/.*\/teacher/)
    })

    test('Navigate to Organizations page from left panel', async () => {
        await homePage.clickElement(homePage.organizationMain)
        await expect(page).toHaveURL(/.*\/organization-admin/)
    })

    test('Verify the page header text from left panel', async () => {
        expect(await homePage.getInnerText(homePage.titlePage)).toContain('Writing Companion')
    })

    test('Navigate to IELTS page from left panel', async () => {
        const link = await homePage.getElementByRole('link', 'IELTS')
        await link.click()
        await expect(page).toHaveURL("https://writing-aide.zerone.id/writing-tips?openAccordion=IELTS")
    })

    test('Navigate to TOEFL page from left panel', async () => {
        const link = await homePage.getElementByRole('link', 'TOEFL')
        await link.click()
        await expect(page).toHaveURL("https://writing-aide.zerone.id/writing-tips?openAccordion=TOEFL")
    })

    test('Navigate to GCSE page from left panel', async () => {
        const link = await homePage.getElementByRole('link', 'GCSE')
        await link.click()
        await expect(page).toHaveURL("https://writing-aide.zerone.id/writing-tips?openAccordion=GCSE")
    })


    test('Navigate to Custom Test page from left panel', async () => {
        const link = await homePage.getElementByRole('link', 'Custom Test')
        await link.click()
        await expect(page).toHaveURL("https://writing-aide.zerone.id/writing-tips?openAccordion=Custom Test")
    })

})
