class TestTakerPage {
    constructor(page) {
        this.page = page;
        this.loginheaderSection = page.locator('header #navigationProfile-Login');
        this.loginNavSection = page.locator('nav #navigationProfile-Login')
        this.textTitle = page.getByText('WritingAide for Test Takers')
        this.video = page.getByRole('img', { name: 'Video Thumbnail' });
        this.howToUse = page.getByText('How to use');
        this.improveWriting = page.getByText('Improve your writing', { exact: true });
        this.score = page.getByRole('region', { name: 'Score' }).getByRole('img');
        this.feedBack = page.getByRole('region', { name: 'Feedback' }).getByRole('img');
        this.transform = page.getByRole('region', { name: 'Transform Your Writing' }).getByRole('img');
        this.suggestion = page.getByRole('region', { name: 'Suggestion' }).getByRole('img');
        this.compare = page.getByRole('region', { name: 'Compare Writing' }).getByRole('img');
        this.contactUs = page.getByRole('link', { name: 'Contact us'});
    }
    async navigate(){
        await this.page.goto('/test-taker')
    }
} 
module.exports = TestTakerPage;