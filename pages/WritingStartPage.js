const { expect} = require('@playwright/test');
const LoginPage = require('./LoginPage');

class WritingStartPage extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.getStartedBtn = page.locator('a#navigationMain-PrepareWriting');
        this.titleText = page.locator('main h1');
        this.examButtons = {
            ielts: page.locator('#writing-SelectExam-1'),
            toefl: page.locator('#writing-SelectExam-2'),
            gcseAqa: page.locator('#writing-SelectExam-3'),
            gcseEdexcel: page.locator('#writing-SelectExam-4'),
            gcseOcr: page.locator('#writing-SelectExam-5'),
        };
        this.taskButtons = {
            task1: page.locator('#writing-SelectTask-1'),
            task2: page.locator('#writing-SelectTask-2'),
            integrated: page.locator('#writing-SelectTask-3'),
            academic: page.locator('#writing-SelectTask-4'),
            aqaPaper1: page.locator('#writing-SelectTask-5'),
            aqaPaper2: page.locator('#writing-SelectTask-6'),
            edexcelPaper1: page.locator('#writing-SelectTask-7'),
            edexcelPaper2: page.locator('#writing-SelectTask-8'),
            ocrPaper1: page.locator('#writing-SelectTask-9'),
            ocrPaper2: page.locator('#writing-SelectTask-10')
        };
        this.submitBtn = page.locator('#writing-StartWriting');
        this.taskDescription = page.locator('.m_e615b15f > div:nth-child(5) p');
    }
    async verifyInitialUIElements() {
        await this.titleText.isVisible();
        for (const btn of Object.values(this.examButtons)) {
            await btn.isVisible();
        }
        for (const btn of Object.values(this.taskButtons)) {
            await btn.isVisible();
        }
        await this.submitBtn.isVisible();
        await expect(this.submitBtn).toHaveAttribute('data-disabled', 'true');
    }
    async noTaskDescriptionAndDisabledSubmit() {
        await expect(this.taskDescription.nth(0)).toBeEmpty()
        await expect(this.taskDescription.nth(1)).toBeEmpty()
        await expect(this.submitBtn).toBeVisible()
        await expect(this.submitBtn).toHaveAttribute('data-disabled', 'true');
    }
    async clickExamButton(name) {
        await this.examButtons[name].click();
    }
    async activeExamButton(activeName) {
        for (const [key, button] of Object.entries(this.examButtons)) {
            if (key === activeName) {
                await expect(button).toHaveClass(/_selectedItem_/);
            } else {
                await expect(button).not.toHaveClass(/_selectedItem/);
            }
        }
    }
    async clickTaskButton(taskName) {
        await this.taskButtons[taskName].click();
    }
    async activeTaskButton(taskName) {
        await expect(this.taskButtons[taskName]).toHaveClass(/_selectedItem_/);
    }
   async getTaskDescription() {
    return await this.taskDescription.nth(0).innerText();
   }
  async getTaskButtonLabel(taskName) {
    return (await this.taskButtons[taskName].innerText()).trim();
  }
  async getAllTaskLabels() {
    const labels = {};
    for (const [key, locator] of Object.entries(this.taskButtons)) {
        if (await locator.isVisible()) {
        labels[key] = (await locator.textContent())?.trim();
    }
    }
    return labels;
  }
}

module.exports = WritingStartPage;