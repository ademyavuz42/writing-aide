const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage')

class WritingQuestion extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.getStartedBtn = page.locator('a#navigationMain-PrepareWriting');
        this.submitBtn = page.locator('#writing-StartWriting');
        this.examType = page.locator('#writingExamType');
        this.taskName = page.locator('#writingTaskName');
        this.countdown = page.locator('#writingCountdown');
        this.instructionText = page.locator('#writingInstruction');
        this.questionBody = page.locator('#writingQuestionBody');
        this.questionPassage = page.locator('#writingQuestionPassage');
        this.questionImage = page.locator('#writingQuestionImage');
        this.activateEditorBtn = page.locator('#writing-StartWriting')
        this.textEditor = page.getByRole('textbox', { name: 'Rich-Text Editor' })
        this.wordCounter = page.locator('h6.mantine-Title-root')
        this.startMessage = page.locator('.__m__-r245 p')

    }
    async selectExam(name) {
        await this.page.getByRole('button', {name: name}).click();
    }
    async selectTask(name) {
        await this.page.getByRole('button', {name: name}).click();
    }
    async startToWriteEssay() {
        await this.getStartedBtn.click();
        await this.selectExam('IELTS')
        await this.selectTask('Task 1')
        await this.submitBtn.click();
    }
    async activateEditor() {
        await this.activateEditorBtn.click();
    }
    async verifyQuestionSection() {
        await this.examType.isVisible();
        await this.taskName.isVisible();
        await this.instructionText.isVisible();
        await this.questionBody.isVisible();
        await this.questionPassage.isVisible();
        await this.questionImage.isVisible();
    }
    async verifyInstructionAndQuestion() {
        const instructionText = await this.instructionText.textContent();
        const questionBodyText = await this.questionBody.textContent();

        expect(instructionText).toContain('20 minutes');
        expect(questionBodyText).toContain('Summarise')
    }
    async typeInEditor(text) {
        const editor = await this.textEditor.waitFor({state: 'visible', timeout: 5000});
        await editor.type(text);
    }
    async getWordCount() {
        await this.wordCounter.waitFor({state: 'visible', timeout: 5000})
        const countText = await this.wordCounter.textContent();
        const match = countText.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }
    async verifyTooltipMessage() {
        await expect(this.startMessage).toBeVisible();
    }

}

module.exports = WritingQuestion;