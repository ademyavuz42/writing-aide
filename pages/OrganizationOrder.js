const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage');
const { console } = require('inspector');

class OrganizationOrder extends LoginPage{
    constructor(page){
        super(page);
        this.page = page;
        this.roleDefault = page.getByRole('button', { name: 'PERSONAL' })
        this.roleAdmin = page.getByRole('menuitem', { name: 'ADMIN'});
        this.navOrders = page.getByRole('link', { name: 'Orders'});
        this.orgCredits = page.locator('#organizationCredits');
        this.redeemBtn = page.getByRole('button', { name: 'Redeem Code'});
        this.redeemTitle = page.locator('section h2');
        this.redeemCodeInput = page.locator('input#redeemCodeInput');
        this.redeemSubmitBtn = page.getByRole('button', { name: 'Redeem'});
        this.topupBtn = page.getByRole('button', { name: 'Top up now'});
        this.topupTitle = page.locator('section h2');
        this.fixedCredits = page.locator('section form div.mantine-Grid-col button')
        this.tableHeaders = page.locator('thead tr th');
        this.dateCells = page.locator('tbody tr td:nth-child(2)');
        this.statusCells = page.locator('tbody tr td:nth-child(6) h6');
    }
    async changeRole(role){
        await this.roleDefault.click();
        await this.page.getByRole('menuitem', { name: role}).click();
        if (role==='ADMIN') {
            await this.page.waitForURL('/organization');
        }
    }
    async clickOnNavOrders(){
        await this.navOrders.click();
    }
    async checkFixedCreditsButtonClickable(){
        const count = await this.fixedCredits.count();
        await expect(count).toBeGreaterThan(0);
        console.log('Number of fixed credits buttons found: ', count);
        for (let i = 0; i < count; i++) {
            const button = this.fixedCredits.nth(i);
            const buttonText = await button.innerText();
            console.log('Button text: ', buttonText);
            await expect(button, `Button "${buttonText}" should be enabled`).toBeEnabled();           
        }
    } 
    async checkTableHeaders(){
        const expectedHeaders = ['No', 'Date', 'Transaction', 'Amount', 'Total Credit', 'Status', 'Action'];
        await expect(this.tableHeaders).toHaveText(expectedHeaders); 
    }
    async checkDateCells(){
        const count = await this.dateCells.count();
        console.log('Number of date cells found: ', count);
        // Extract and parse all dates
        const dates = [];
        for (let i = 0; i < count; i++) {
            const text = await this.dateCells.nth(i).textContent();
            console.log('Date text: ', text);
            const parsedDate = Date.parse(text);
            if (!isNaN(parsedDate)) {
                dates.push(parsedDate);
            }          
        }
        // Check if dates are sorted in descending order
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
    }
    async checkStatusCells(){
        const count = await this.statusCells.count();
        for (let i = 0; i < count; i++) {
            const tag = this.statusCells.nth(i);
            const text = (await tag.textContent()).trim();

            // Get computed color style
            const color = await tag.evaluate(el => getComputedStyle(el).color);

            if (text === 'PAID') {
                expect(color).toMatch(/rgb\(.*(0,\s*128,\s*0|15,\s*175,\s*115).*?\)/); // Green
            }
            else if (text === 'EXPIRED') {
                expect(color).toMatch(/rgb\(.*(255,\s*0,\s*0|255,\s*107,\s*107).*?\)/); // Red
            } else if (text ==='INCOMPLETE') {
                expect(color).toMatch(/rgb\(255,\s*107,\s*107\)/); // Orange
            } else {
                throw new Error('Unexpected status tag: ', text);
            }
        }
    }
   
}

module.exports = OrganizationOrder;