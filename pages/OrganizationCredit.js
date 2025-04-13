const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage');
const { console } = require('inspector');

class OrganizationCredit extends LoginPage{
    constructor(page){
        super(page);
        this.page = page;
        this.roleDefault = page.getByRole('button', { name: 'PERSONAL'});
        this.navCredit = page.getByRole('link', { name: 'Credits'});
        this.headerText = page.locator('main h3');
        this.tableHeaders = page.locator('table th')
        this.tableRows = page.locator('tbody tr');
        this.currentBalance = page.locator('#organizationCredits');
    }
    async changeRole(role){
        await this.roleDefault.click();
        await this.page.getByRole('menuitem', { name: role}).click();
        if (role==='ADMIN') {
            await this.page.waitForURL('/organization');
        }
    }
    async clickOnNavCredit(){
        await this.navCredit.click();
    }
    async checkTableHeaders(){
        const expectedHeaders = ['No', 'Date', 'Description', 'Amount', 'Balance'];
        await expect(this.tableHeaders).toHaveText(expectedHeaders); 
    }
    async checkAmountCells(){
        const count = await this.tableRows.count();
        for (let i = 0; i < count; i++) {
            const amountCell = this.tableRows.nth(i).locator('td:nth-child(4)');
            const amountText = await amountCell.textContent();
            console.log('Amount text: ', amountText);
            const color = await amountCell.locator('p').evaluate(el => getComputedStyle(el).color);

            if (amountText.includes('-')) {
                expect(color).toBe('rgb(255, 107, 107)'); // red color
            }else {
                expect(color).toBe('rgb(15, 175, 115)'); // green color
            }           
        }
    }
    async calculateTotalCredit(){
        const count = await this.tableRows.count();
        let totalCredit = 0;
        for (let i = count -1; i >= 0; i--) {
            const amountCell = this.tableRows.nth(i).locator('td:nth-child(4)');
            const amountText = await amountCell.textContent();
            const amountValue = parseInt(amountText.replace(/[^\d-]/g, ''), 10);
            totalCredit += amountValue;
        }
        const currentBalanceText = await this.currentBalance.textContent();
        const currentBalanceValue = parseInt(currentBalanceText.trim(), 10);
        console.log('Total Credit: ', totalCredit);
        console.log('Current Balance: ', currentBalanceValue);
        expect(totalCredit).toBe(currentBalanceValue);
    }
    async checkBalncedCells(){
        const count =  await this.tableRows.count();
        for (let i = count-1; i >= 0; i--) {
            const currentRow = this.tableRows.nth(i);
            const nextRow =  this.tableRows.nth(i-1);

            const currentBalanceText = await currentRow.locator('td:nth-child(5)').textContent();
            const creditText = await nextRow.locator('td:nth-child(4)').textContent();
            const nextBalanceText = await nextRow.locator('td:nth-child(5)').textContent();
            
            const currentBalance = parseInt(currentBalanceText.trim(), 10);
            const credit = parseInt(creditText.replace(/[^\d-]/g, ''), 10);
            const nextBalance = parseInt(nextBalanceText.trim(), 10);

            const expectedNextBalance = currentBalance + credit;

            await expect(nextBalance).toBe(expectedNextBalance);         
        }
    }
}

module.exports = OrganizationCredit;