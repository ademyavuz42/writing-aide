const LoginPage = require('./LoginPage');

class AdminPage extends LoginPage{
    constructor(page){
        super(page);
        this.page = page;
        this.roleDefault = page.getByRole('button', { name: 'PERSONAL' })
        this.orgName = page.getByRole('heading', { name: 'Example Organization' });
        this.orgDescription = page.locator('h3.mantine-Title-root + p');
        this.orgCredit = page.locator('p:below(:text("Organization Credit Balance"))').first();
        this.reservedCredit = page.locator('p:below(:text("Reserved Credit"))').first();
        this.userTable = page.locator('table.mantine-Table-table');
        this.userRows = page.locator('tbody tr');
        this.searchInput = page.getByPlaceholder('Search');
        this.addUserBtn = page.locator('button#actionTo-AddUserModal');
        this.userFormHeader = page.locator('section header p');
        this.userFormName = page.locator('input#inputModal-BatchUserName-0');
        this.userFormEmail = page.locator('input#inputModal-BatchEmail-0');
        this.userFormClass = page.locator('input#inputModal-BatchClass-0');
        this.userFormRole = page.locator('input#inputModal-BatchRole-0');
        this.transferCreditBtn = page.getByRole('button', { name: 'Transfer Credit'});
        this.transferModal = page.locator('[role="dialog"]');
        this.transferHeader = this.transferModal.locator('header h2');
        this.transferSrchInput =this.transferModal.getByPlaceholder('Search users...');
        this.transferAmountInput = this.transferModal.locator('input#inputModal-SetCreditValue-0');
        this.transferCreditSubmitBtn = this.transferModal.getByRole('button', {name: 'Transfer Credit'});
        this.submissionLinks = page.locator('table tbody tr td:nth-child(5) a');
        this.userWritingHeader = page.locator('main h2'); 
    }
    async changeRole(role){
        await this.roleDefault.click();
        await this.page.getByRole('menuitem', { name: role}).click();
        if (role==='ADMIN') {
            await this.page.waitForURL('/organization');
        }
    }
    async getOrgCreditAmount(){
       const creditText = await this.orgCredit.innerText();
       console.log('Org Credit Amount: ', creditText);
       const amount = parseInt(creditText.match(/\d+/)[0], 10);
       return amount;
    }
    async getReservedCreditAmount(){
       const creditText = await this.reservedCredit.innerText();
       console.log('Reserved Credit Amount: ', creditText);
       const amount = parseInt(creditText.match(/\d+/)[0], 10);
       return amount;
    }
    async findAndClickMaxSubmittedWriting(){
        await this.page.waitForSelector('table tbody tr td:nth-child(5) a', { timeout: 5000});
        // await this.page.screenshot({ path: 'debug-page.png', fullPage: true });
        const count = await this.submissionLinks.count();
        console.log('Number of submission links found: ', count);
        let maxIndex = -1;
        let maxValue = -1;
        for (let i = 0; i < count; i++) {
            const text = await this.submissionLinks.nth(i).innerText();
            const value = parseInt(text.trim(), 10);
            if (!isNaN(value) && value > maxValue) {
                maxValue = value;
                maxIndex = i;
            }           
        }

        if (maxIndex !== -1) {
            console.log(`Clicking on submission link with max value: ${maxValue}`);

            // Handles new tab
            const [newTab] = await Promise.all([
                this.page.waitForEvent('popup'),
                this.submissionLinks.nth(maxIndex).click({ force: true})
            ]);

            // Wait for the new tab to load
            await newTab.waitForLoadState('domcontentloaded');
            console.log('New page URL: ', newTab.url());
            return newTab;
        } else {
            throw new Error('No valid submission links found.');
        }
    }
   
}

module.exports = AdminPage;