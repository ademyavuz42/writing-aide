class LoginPage {
    constructor(page) {
        this.page = page;
        this.mainImage = this.page.locator('div.mantine-visible-from-md img');
        this.emailInput = this.page.getByRole('textbox', { name: 'email' });
        this.passwordInput = this.page.getByRole('textbox', { name: 'password' });
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });
        this.rememberMeCheckbox = this.page.getByRole('checkbox', { name: 'Remember me' });
        this.errorMessage = this.page.locator('p.text-md');
        this.socialLoginButton = this.page.locator('#actionTo-SocialiteLogin')
        this.copyright = this.page.locator('footer p')
        this.termsLink = this.page.locator('#navigationFooter-TermsAndConditions')
        this.privacyLink = this.page.locator('#navigationFooter-Privacy')
        this.rememberMeCheckbox = this.page.getByLabel('Remember me')
        this.forgotPasswordLink = this.page.locator('#navigationMain-ForgotPassword')
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