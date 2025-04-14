const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage');

class TeacherAssignment extends LoginPage{
    constructor(page){
        super(page);
        this.page = page;
        this.roleDefault = page.getByRole('button', { name: 'PERSONAL'});
        this.navAssignment = page.getByRole('link', { name: 'Assignments'});
        this.headingTitle = page.getByRole('heading', { name: 'Task Assignments'});
        this.idCells = page.locator('td:nth-child(1)');
        this.taskNameCells = page.locator('td:nth-child(2)');
        this.deadlineCells = page.locator('td:nth-child(3)');
        this.typeCells = page.locator('td:nth-child(4)');
        this.statusCells = page.locator('td:nth-child(5)');
        this.actionCells = page.locator('td:nth-child(6)');
        this.detailLinks = this.actionCells.locator('a');
        this.headers = {
            id: page.locator('th:nth-child(1)'),
            taskName: page.locator('th:nth-child(2)'),
            deadline: page.locator('th:nth-child(3)'),
            type: page.locator('th:nth-child(4)'),
            status: page.locator('th:nth-child(5)'),
            action: page.locator('th:nth-child(6)')
        };
       
       this.rows = page.locator('tbody tr');
    }
    async changeRole(role){
        await this.roleDefault.click();
        await this.page.getByRole('menuitem', { name: role}).click();
        if (role==='TEACHER') {
            await this.page.waitForURL('/teacher/dashboard');
        }
    }
    async clickOnAssignment(){
        await this.navAssignment.click();
    }
    async getTypeByTaskId(taskId){
        const rows = this.rows;
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const idCell = await row.locator('td:nth-child(1)');
            await idCell.waitFor({ state: 'visible', timeout: 3000 });
            const idText = await idCell.textContent();
            if (idText && idText.trim() === taskId) {
                const typeCell = await row.locator('td:nth-child(4)');
                return await typeCell.textContent();
            }
        }
        return null;
    }
    async clickDetailLinkByTaskId(taskId){
        const count = await this.rows.count();
        for (let i = 0; i < count; i++) {
            const idText = await this.idCells.nth(i).innerText();
            if (idText.trim() === taskId) {
                await this.detailLinks.nth(i).click();
                return;
            }
        }
        throw new Error(`Details link for task ID ${taskId} not found.`);
    }
    async getAllDeadlines(){
        const count = await this.deadlineCells.count();
        const dates = [];
        for (let i = 0; i < count; i++) {
            const text = await this.deadlineCells.nth(i).innerText();
            dates.push(text); 
        }
        return dates;
    }
    async getAllTaskIds(){
        const count = await this.idCells.count();
        const ids = [];
        for (let i = 0; i < count; i++) {
            const text = await this.idCells.nth(i).innerText();
            const numericId = text.replace(/ID/, '').trim();
            ids.push(numericId); 
        }
        return ids;
    }
}

module.exports = TeacherAssignment;