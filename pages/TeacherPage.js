class TeacherPage {
    constructor(page) {
        this.page = page;
        this.loginheaderSection = page.locator('header #navigationProfile-Login');
        this.loginNavSection = page.locator('nav #navigationProfile-Login')
        this.textTitle = page.getByText('WritingAide for Teachers')
        this.video = page.getByRole('img', { name: 'Video Thumbnail' });
        this.signUpProcedure = page.getByText('Sign up your organization');
        this.writingTasks = page.getByText('Writing Tasks', { exact: true });
        this.testTitleTryOurAI = page.getByText('Try our AI-Powered Generative');
        this.registorOrganization = page.getByRole('link', { name: 'Register Your School' }).first();
        this.tryForFree = page.getByRole('link', { name: 'Try for free' }).first();
      
    }
    async navigate(){
        await this.page.goto('/teacher')
    }
}
module.exports = TeacherPage;