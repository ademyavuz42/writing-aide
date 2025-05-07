const LoginPage = require("./LoginPage");

class RedeemPage extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.orderPage = page.getByRole('link', { name: 'Orders'});
        this.redeemCodeBtn = page.getByRole('button', { name: 'Redeem Code'});
        this.modal = page.locator('[data-modal-content="true"]')
        this.modalRedeem = page.locator('section h2')
        this.modalRedeemClsBtn = page.locator('section button svg')
        this.redeemDesc = page.locator('section form p').first()
        this.redeemInput = page.locator('section input')
        this.redeemBtn = page.getByRole('button', { name: 'Redeem'})
        this.successIcon = page.locator('svg[fill="#0FAF73"]')
        this.errorIcon = page.locator('svg.tabler-icon-xbox-x-filled')
    }
    async openModal(){
        await this.orderPage.click();
        await this.redeemCodeBtn.click()
        await this.modal.waitFor({state: 'visible'})
    }
    async closeModal() {
        await this.modalRedeemClsBtn.click();
        await this.modal.waitFor({state: 'hidden'});
    }
    async enterCode(code) {
        await this.redeemInput.fill(code);
    }
    async clickRedeem() {
        await this.redeemBtn.click();
    }
    async isRedeemDisabled() {
        return await this.redeemBtn.isDisabled();
    }
    async isSuccessIconVisible(){
        await this.page.waitForFunction(
            (selector) => {
                const el = document.querySelector(selector);
                return el && window.getComputedStyle(el).borderColor === 'rgb(15, 175, 115)';
            },
            '#redeemCodeInput',
            { timeout: 2000}
           );
           return true;    
        }
    async isErrorIconVisible() {
       await this.page.waitForFunction(
        (selector) => {
            const el = document.querySelector(selector);
            return el && window.getComputedStyle(el).borderColor === 'rgb(255, 107, 107)';
        },
        '#redeemCodeInput',
        { timeout: 2000}
       );
       return true;
      }
      

}

module.exports = RedeemPage;