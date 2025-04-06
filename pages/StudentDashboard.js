const LoginPage = require('./LoginPage');

class StudentDashboard extends LoginPage{
    constructor(page) {
        super(page)
        this.page = page;
        this.logo = page.locator('header img');
        this.writingLink = page.getByRole('link', { name: 'Writings' });
        this.ordersLink = page.getByRole('link', { name: 'Orders' });
        this.creditLink = page.getByRole('link', { name: 'Credits' });
        this.creditAmount = page.locator('header .mantine-focus-auto.m_b6d8b162.mantine-Text-root').nth(4);
        this.profile = page.getByRole('button', { name: 'Settings' });
        this.setting = page.getByRole('menuitem', { name: 'Settings' }); 
        this.logout = page.getByRole('menuitem', { name: 'Log Out' }); 
        this.welcomeMessage = page.getByRole('heading', { name: 'Hi, ' });
        this.roleDefault = page.getByRole('button', { name: 'PERSONAL' })
        this.rolePersonal = page.getByRole('menuitem', { name: 'PERSONAL' });
        this.roleStudent = page.getByRole('menuitem', { name: 'STUDENT' });
        this.getStarted = page.getByRole('link', { name: 'Get Started' });
        this.recentWriting = page.getByRole('heading', { name: 'Recent Writings' });
        this.rating = page.getByRole('button', { name: 'Rating & Review' });
        this.examTypeLocator = page.locator('div#writingTest > span.mantine-Badge-label');
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async getWelcomeText() {
        const text = await this.welcomeMessage.innerText();
        return text;
    }

    async getCreditAmount() {
            const amount = await this.creditAmount.innerText();
            console.log(amount);
            return amount;
    }

    async assertCreditIsNumber() {
        const creditText = await this.creditAmount.innerText();
        const creditNumber = parseInt(creditText.match(/\d+/)[0], 10); // Extract number
        return creditNumber;
    }
    
    async isElementVisible(element){
        return await element.isVisible()
    }

    async getElementByRole(role, name){
        return await this.page.getByRole(role, {name: name})
    }

    async getTestTitlesText(){
        const counts = await this.examTypeLocator.count();
        console.log('Number of tests found: ', counts);
        const titles = [];
        for (let i = 0; i < counts; i++) {
            const title = await this.examTypeLocator.nth(i).innerText();
            titles.push(title);
        }
        return titles;
      }
    
   
}
module.exports = StudentDashboard;