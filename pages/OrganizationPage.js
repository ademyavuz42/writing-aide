class OraganizationPage {
    constructor(page) {
        this.page = page;
        this.loginheaderSection = page.locator('header #navigationProfile-Login');
        this.loginNavSection = page.locator('nav #navigationProfile-Login')
        this.textTitle = page.getByText('WritingAide for Admin')
        this.video = page.getByRole('img', { name: 'Video Thumbnail' });
        this.signUpProcedure = page.getByText('Sign up your organization');
        this.writingTasks = page.getByText('Writing Tasks', { exact: true });
        this.registorOrganization = page.getByRole('link', { name: 'Register Your Organization' }).first();
      
    }
    async navigate(){
        await this.page.goto('/organization-admin')
    }
}
module.exports = OraganizationPage;