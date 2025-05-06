const LoginPage = require("./LoginPage");

class TopupPage extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.modalPersonal = page.locator('section header') 
        this.options = {
            7: page.locator('button:has-text("Bulk 7")'),
            15: page.locator('button:has-text("Bulk 15")'),
            30: page.locator('button:has-text("Bulk 30")'),
            50: page.locator('button:has-text("Bulk 50")'),
        };
        this.otherAmountBtn = page.locator('#actionTo-SelectOtherCredit')
        this.otherInput = page.locator('#inputModal-TopUp')
        this.totalPrice = page.locator('text=Total').locator('.. >> text=US $')
        this.discountMessage = page.locator('text=You saved');
        this.payNowBtn = page.locator('button:has-text("Pay Now")')
        this.orderPage = page.getByRole('link', { name: 'Orders'});
        this.topupBtn =  page.getByRole('button', { name: 'Top up now'})
    }
    async open() {
        await this.orderPage.click();
        await this.topupBtn.click()
        await this.modalPersonal.waitFor({state: 'visible'})
    }
    async selectBulk(amount) {
        await this.options[amount].click();
    }
    async enterOtherAmount(amount) {
        await this.otherAmountBtn.click();
        await this.otherInput.fill(amount.toString());
    }
    async getDiscountMessage() {
        return await this.discountMessage.innerText();
    }
   
}

class OrgTopupPage extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.modalOrganization = page.locator('section header') 
        this.options = {
            100: page.locator('button:has-text("100 Credits")'),
            500: page.locator('button:has-text("500 Credits")'),
            1000: page.locator('button:has-text("1000 Credits")'),
            5000: page.locator('button:has-text("5000 Credits")'),
            10000: page.locator('button:has-text("10000 Credits")'),
        };
        this.otherAmountBtn = page.locator('#actionTo-SelectOtherCredit')
        this.otherInput = page.locator('input[placeholder*="Enter desired amount"]');
        this.totalPrice = page.locator('text=Total').locator('.. >> text=US $')
        this.discountMessage = page.locator('text=You saved');
        this.payNowBtn = page.locator('button:has-text("Pay Now")')
        this.orderPage = page.getByRole('link', { name: 'Orders'});
        this.topupBtn =  page.getByRole('button', { name: 'Top up now'})
        this.defaultRole = page.getByRole('button', { name: 'PERSONAL' })
        this.adminRole = page.getByRole('menuitem', { name: 'ADMIN' });

    }

    async changeRole(role){
        await this.defaultRole.click();
        await this.page.getByRole('menuitem', { name: role}).click();
        // if (role==='ADMIN') {
        //     await this.page.waitForURL('/organization');
        // }
    }

    async open() {
        await this.changeRole('ADMIN');
        await this.page.waitForTimeout(2000)
        await this.orderPage.click();
        await this.topupBtn.click();
        await this.modalOrganization.waitFor({ state: 'visible' });
    }
    async selectBulk(amount) {
        await this.options[amount].click();
    }
    async enterOtherAmount(amount) {
        await this.otherAmountBtn.click();
        await this.otherInput.fill(amount.toString());
    }
    async getDiscountMessage() {
        return await this.discountMessage.innerText();
    }

}

module.exports = {
    TopupPage,
    OrgTopupPage
}