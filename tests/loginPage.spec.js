const {test, expect, chromium} = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const messages = require('../utils/messages');
const userData = require('../utils/userData');

test.describe('Login Page Tests', () => {
    let browser, page, loginPage;

    test.beforeAll(async()=> {
        browser = await chromium.launch({headless: true});
    })
    test.beforeEach(async()=>{
        page = await browser.newPage();
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    })
    test.afterEach(async()=>{
        await page.close();
    })
    test.afterAll(async()=>{
        await browser.close();
    })
    
    test('Verify title and URL of Login page', async()=>{
        await expect(page).toHaveURL('/login');
        await expect(page).toHaveTitle('Sign In - Writing-Aide');
    })

    test('Student login successfully', async()=>{
        await loginPage.login(userData.student.email, userData.student.password);
        await expect(page).toHaveURL('/dashboard');
    })

    test('SuperAdmin login successfully', async()=>{
        await loginPage.login(userData.superAdmin.email, userData.superAdmin.password);
        await expect(page).toHaveURL('/dashboard');
    })

    test('Admin login successfully', async()=>{
        await loginPage.login(userData.admin.email, userData.admin.password);
        await expect(page).toHaveURL('/dashboard');
    })

    test('Teacher login successfully', async()=>{
        await loginPage.login(userData.teacher.email, userData.teacher.password);
        await expect(page).toHaveURL('/dashboard');
    })

    test('Should show error for missing "@" in email', async()=>{
        await loginPage.login(userData.invalidUser.missingAtEmail, userData.teacher.password);
        
        const errorMessage = await loginPage.validateMessage(loginPage.emailInput);
        expect(errorMessage).toContain(messages.email.missingAt);
    })

    test('Should show error for missing domain in email', async()=>{
        await loginPage.login(userData.invalidUser.missingDomainEmail, userData.teacher.password);
        
        const errorMessage = await loginPage.validateMessage(loginPage.emailInput);
        expect(errorMessage).toContain(messages.email.missingDomain);
    })

    test('Should show error for missing password', async()=>{
        await loginPage.login(userData.student.email, '');
        
        const errorMessage = await loginPage.validateMessage(loginPage.passwordInput);
        expect(errorMessage).toContain(messages.password.missingPassword);
    })

    test('Should show error for unregistered email', async()=>{
        await loginPage.login(userData.invalidUser.invalidEmail,userData.student.password);
        
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(messages.email.invalidEmail);
    })

    test('Should show error for incorrect password', async()=>{
        await loginPage.login(userData.student.email,userData.invalidUser.incorrectPassword);
        
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(messages.password.incorrectPassword);
    })

    test('Login with Gmail', async()=>{
        await loginPage.clickElement(loginPage.socialLoginButton);
        expect(await page.locator('h1').innerText()).toContain('Sign in')
    })

    test('Verify the visibility of the logo on the login page', async()=>{
        await expect(loginPage.mainImage).toBeVisible()
    })

    test('Verify the visibility of the copyright on the login page', async()=>{
        await expect(loginPage.footer.copyright).toBeVisible()
    })

    test('Verify the functionality of the Terms-and-Condition link', async()=>{
        await expect(loginPage.footer.termsLink).toBeVisible()
        await loginPage.clickElement(loginPage.footer.termsLink);
        await expect(page).toHaveURL('/terms-of-use')
    })

    test('Verify the functionality of the Privacy-Policy link', async()=>{
        await expect(loginPage.footer.privacyLink).toBeVisible()
        await loginPage.clickElement(loginPage.footer.privacyLink);
        await expect(page).toHaveURL('/privacy')
    })

    test('Verify the password field is masked', async()=>{
        await expect(loginPage.passwordInput).toBeVisible()
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
    })

    test('Verify the Remember me checkbox is visible', async()=>{
        await expect(loginPage.rememberMeCheckbox).toBeVisible()
        await expect(loginPage.rememberMeCheckbox).not.toBeChecked()
        await loginPage.rememberMeCheckbox.click()
        await expect(loginPage.rememberMeCheckbox).toBeChecked()
    })

    test('Verify forgot password link', async()=>{
        await loginPage.clickElement(loginPage.forgotPasswordLink);
        await expect(page).toHaveURL('forgot-password')
        await page.locator('input').fill(userData.admin.email)
        await page.locator('#actionTo-ForgotPassword').click()
        await expect(page.getByRole('heading')).toHaveText('Reset Link Sent!', {timeout: 5000})
    })

    // test(' =Full page screenshot' , async()=>{
    //     await expect(page).toHaveScreenshot('loginPage.png', {fullPage: true})
    // })




})