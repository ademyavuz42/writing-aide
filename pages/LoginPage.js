class LoginPage {
    constructor(page) {
        this.page = page;
        this.mainImage = page.locator('div.mantine-visible-from-md img');
        this.emailInput = page.getByRole('textbox', { name: 'email' });
        this.passwordInput = page.getByRole('textbox', { name: 'password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
        this.errorMessage = page.locator('p.text-md');
        this.socialLoginButton = page.locator('#actionTo-SocialiteLogin');
        this.rememberMeCheckbox = page.getByLabel('Remember me')
        this.forgotPasswordLink = page.locator('#navigationMain-ForgotPassword')
        this.footer = {
            copyright: page.locator('footer p'),
            termsLink: page.locator('#navigationFooter-TermsAndConditions'),
            privacyLink: page.locator('#navigationFooter-Privacy')
        }
        this.profileButton = page.locator('button[aria-label="Settings"]')
        this.logoutButton = page.getByRole('paragraph', { name: 'Log Out'})
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async clickElement(element){
        await element.click()
    }

    async clickSignIn() {
        await this.signInButton.click()
    }

    async enterEmail(email) {
        await this.emailInput.fill(email)
    }
    
    async enterPassword(password) {
        await this.passwordInput.fill(password)
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickSignIn();
    }

    async getErrorMessage() {
        return await this.errorMessage.innerText();
    }

    async validateMessage(element) {
        return await element.evaluate(el => el.validationMessage)
    }
}
module.exports = LoginPage;