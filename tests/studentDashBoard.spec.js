const { test, expect, chromium } = require('@playwright/test');
const StudentDashboard = require('../pages/StudentDashboard');
const userData = require('../utils/userData');
const exp = require('constants');
const { execPath } = require('process');

test.describe('Student Dashboard Page Tests', () => {
    let browser, context, page, student;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
    });

    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        student = new StudentDashboard(page);
        await student.navigate();
        await student.login(userData.student.email, userData.student.password);
    });

    test.afterEach(async () => {
        await page.close();
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test('Verify title and URL of Dashboard page', async () => {
        await expect(page).toHaveURL('/dashboard');
        await expect(page).toHaveTitle('Dashboard - Writing-Aide');
    });

    test('Verify the welcome message', async() => {
        const welcomeMessage = await student.getWelcomeText();
        console.log(welcomeMessage);
        expect(welcomeMessage).toContain('Hi,');
    })

    test('Verify the credit amount displayed', async() => {
        const creditAmount = await student.getCreditAmount();
        expect(creditAmount).not.toBeNull();
    })

    test('Verify credit amount is a number', async () => {
       const result = await student.assertCreditIsNumber();
       expect(typeof result).toBe('number');
      });

      test('Verify logo is visible and clickablr', async ()=>{
        await expect(student.logo).toBeVisible();
        await student.logo.click();
        await expect(page).toHaveURL('/');
      });

      test('Verify navigation links in the header', async()=>{
        const navLinks = [
           
            {link: student.writingLink, url: '/writing'},
            {link: student.ordersLink, url: '/order'},
            {link: student.creditLink, url: '/credit'},
        ];
       
        for(const {link, url} of navLinks){
            await link.click();
            await expect(page).toHaveURL(url);
        }
      })

      test('Verify visibility of setting and logout button', async()=>{
        await expect(student.profile).toBeVisible();
        await student.profile.click();
        await expect(student.setting).toBeVisible();
        await expect(student.logout).toBeVisible();
      })

      test('Verify setting button functionality', async()=>{
        await student.profile.click();
        await student.setting.click();
        await expect(page).toHaveURL('/profile')
        await expect(page.getByText('Change Password')).toBeVisible();
      })

      test('Verify logout button functionality', async()=>{
        await student.profile.click();
        await student.logout.click();
        await expect(page).toHaveURL('/')
      })

      test('Verify the roles are visible', async()=>{
        await expect(student.roleDefault).toBeVisible();
        await student.roleDefault.click();
        await expect(student.rolePersonal).toBeVisible();
        await expect(student.roleStudent).toBeVisible();
      });

    test('Verify the functionality of Get Started button', async()=>{
        await expect(student.getStarted).toBeVisible();
        await student.getStarted.click();
        await expect(page).toHaveURL('/writing/start')
    })

    test('Verify Role Student button functionality', async()=>{
        await expect(student.roleDefault).toBeVisible();
        await student.roleDefault.click();
        await expect(student.roleStudent).toBeVisible();
        await student.roleStudent.click();
        await expect(page).toHaveURL('/my-assignment');
    })
    
    test('Verify the visibility of the recent writings', async()=>{
        await expect(student.recentWriting).toBeVisible();
    })

    test('Verify the functionality of Rating button', async()=>{
        await expect(student.rating).toBeVisible();
    })

    test('Verify the visibility of taken test titles', async()=>{
        await page.waitForSelector('div.mantine-Badge-root > span.mantine-Badge-label', { timeout: 5000 });
        await page.screenshot({ path: 'debug.png', fullPage: true });
        await expect(page).toHaveScreenshot('debug.png', { fullPage: true });
        const titles = await student.getTestTitlesText();
        console.log('Test titles: ', titles);
        expect(titles.length).toBeGreaterThan(0);
    })

  
});

