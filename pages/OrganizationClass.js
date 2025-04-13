const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage');
const { console } = require('inspector');

class OrganizationClass extends LoginPage{
    constructor(page){
        super(page);
        this.page = page;
        this.roleDefault = page.getByRole('button', { name: 'PERSONAL'});
        this.navClass = page.getByRole('link', { name: 'Classes'});
        this.classNameInput = page.locator('#inputModal-EditClassName');
        this.createClassBtn = page.locator('#inputModal-EditClassSubmit');
        this.classTableRows = page.locator('tbody tr');
        this.totalClassCount = page.locator('text=total classes:').locator('span');
        this.deleteClassBtn = '#actionTo-DeleteClassModal';
        this.deleteClassConfirmBtn = page.locator('section').getByRole('button', { name: 'Delete'});
        this.editClassBtn = page.locator('#actionTo-EditClassModal');
        this.inputModalName = page.locator('section input#inputModal-EditClassName');
        this.inputModalSubmit = page.locator('section button#inputModal-EditClassSubmit')
    }
    async changeRole(role){
        await this.roleDefault.click();
        await this.page.getByRole('menuitem', { name: role}).click();
        if (role==='ADMIN') {
            await this.page.waitForURL('/organization');
        }
    }
    async clickOnNavClass(){
        await this.navClass.click();
    }
    async createClass(className){
        await this.classNameInput.fill(className);
        await this.createClassBtn.click();
    }
    async getClassRowsCount(){
        return await this.classTableRows.count();
    }
    async getLastClassCode(){
        const lastRow = this.classTableRows.last();
        return await lastRow.locator('td:nth-child(2)').textContent();
    }
    async getTotalClassCount(){
        const totalText = await this.totalClassCount.textContent();
        const totalCount = totalText.match(/\d+/)
        return totalCount ? parseInt(totalCount[0], 10) : 0;
    }
    async deleteClassName(className){
        const rows = this.classTableRows;
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const nameCell = await row.locator('td:nth-child(1)');
            await nameCell.waitFor({ state: 'visible', timeout: 3000 });
            const nameText = await nameCell.textContent();
            if (nameText && nameText.trim() === className) {
                const deleteBtn = row.locator(this.deleteClassBtn);
                await deleteBtn.click();

                await this.deleteClassConfirmBtn.waitFor({state: 'visible', timeout: 3000});
                await this.deleteClassConfirmBtn.click();

                await expect(row).toBeAttached({ timeout: 5000});
                console.log(`Class "${className}" deleted successfully.`);           
            } 
        }
    }
    async getValidationMessage(){
        const message = await this.classNameInput.evaluate((input) => input.validationMessage);
        return message;
    }
    async getAllClassCodes(){
        const rows = await this.classTableRows.all();
        const classCodes = [];
        for ( const row of rows){
            const codeCell = await row.locator('td').nth(1);
            await codeCell.waitFor();
            const codeText = await codeCell.textContent();
            const code = codeText ? codeText.trim() : '';
            classCodes.push(code);
        }
        return classCodes;
    }
    async editClassName(oldName, newName) {
        const rows = this.classTableRows;
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const name = (await row.locator('td').nth(0).textContent()).trim();

            if (name === oldName) {
                const editBtn = row.locator(this.editClassBtn).click();
                await this.inputModalName.fill(newName);
                await this.inputModalSubmit.click();
                
                break;
            }           
        }
    }
    async classNameExists(nameToFind) {
        const rows = this.classTableRows; // Locator
        const count = await rows.count();
        console.log(`Checking for class "${nameToFind}" among ${count} rows.`); // Debug log

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const nameCell = row.locator('td').nth(0);

            try {
                // Wait for the cell to be stable before getting text
                await nameCell.waitFor({ state: 'visible', timeout: 3000 });
                const name = (await nameCell.textContent()).trim();
                console.log(`Row ${i}: Found name "${name}"`); // Debug log

                if (name === nameToFind) {
                    console.log(`Match found for "${nameToFind}" at row ${i}`); // Debug log
                    return true; // Found it!
                }
            } catch (error) {
                // Handle cases where a row might disappear during the check
                console.warn(`Could not read name from row ${i}. It might have been removed. Error: ${error.message}`);
            }
        }

        // Only return false if the loop completes without finding the name
        console.log(`Class "${nameToFind}" not found after checking all rows.`); // Debug log
        return false;
    }

}

module.exports = OrganizationClass;