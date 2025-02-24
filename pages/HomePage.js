class HomePage {
    constructor(page) {
        this.page = page;
        this.headerSection = this.page.locator('header')
        this.logo = this.headerSection.locator('img')
        this.loginButton = this.headerSection.getByRole('link', {name:'Login'})
        this.signUpButton = this.headerSection.getByRole('link', {name:'Sign Up'})
        this.navigationButton = this.page.locator('#navigation-openNavigation-Desktop')
        this.navBar = this.page.locator('nav')
        this.homeLink = this.navBar.getByRole('link', {name: 'Home'})
        this.testTakerLink = this.navBar.getByRole('link', {name: 'Test Takers'})
        this.teacherLink = this.navBar.getByRole('link', {name: 'Teacher'})
        this.organizationLink = this.navBar.getByRole('link', {name: 'Organization'})
        this.aboutUsLink = this.navBar.getByRole('link', {name: 'About us'})
        this.writingTipsLink = this.navBar.getByRole('link', {name: 'Writing Tips'})
        this.mainSection = this.page.locator('main')
        this.video = this.mainSection.getByRole('img', {name: 'Video Thumbnail'})

    }

    async navigate() {
        await this.page.goto('/')
    } 

    async getTitle() {
        return this.page.title()
    }

    async getUrl(){
        return this.page.url()
    }

    async isElementVisible(element){
        return await element.isVisible()
    }

    async clickElement(element){
        await element.click()
    }
}

module.exports = HomePage;