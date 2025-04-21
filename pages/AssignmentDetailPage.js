const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage');
const exp = require('constants');

class AssignmentDetailPage extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.detailLinkFirst = page.locator('#navigationOther-Detail-115')
        this.backBtn = page.locator('main').getByRole('link', { name: 'Back' });
        this.instruction = page.locator('#writingInstruction');
        this.questionBody = page.locator('#writingQuestionBody');
        this.diagramImage = page.locator('#writingQuestionImage')
        this.userResponseTitle = page.getByRole('heading', { name: 'Your Writing Response' });
        this.userResponse = page.locator('main span.mantine-Text-root div');
        this.vocabularyTips = page.locator('#mantine-p91hs064c-target');
        this.suggestedResponse = page.getByRole('heading', { name: 'Suggested Response' });
        this.suggestedResponseContent = page.locator('#mantine-309ab0ve5-panel-ImprovedWriting');
        this.predictedScore = page.getByText('95'); //         /^Predicted Score/, { exact: false}
        this.wordCount = page.getByText('110');
        this.complitionTime = page.getByRole('heading', { name: ': 02 : 06' });
        this.transformedWriting = page.getByRole('button', { name: 'Transformed Writing' });
        this.transformEditBtn = page.getByRole('button', { name: 'Edit' });
        this.richTextEditor = page.getByRole('textbox', { name: 'Rich-Text Editor' });
        this.updateBtn = page.getByRole('button', { name: 'Update' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });

    }
    async clickDetailLink() {
        await expect(this.detailLinkFirst).toBeVisible();
        await this.detailLinkFirst.click();
        await expect(this.backBtn).toBeVisible();
    }
    async verifyAllSectionsVisible() {
        await this.instruction.isVisible();
        await this.questionBody.isVisible();
        await this.diagramImage.isVisible();
        await this.userResponseTitle.isVisible();
        await this.vocabularyTips.isVisible();
        await this.suggestedResponse.isVisible();
    }
    async verifyInstructionText() {
        const instructionText = await this.instruction.textContent();
        const expectedText = 'Write at least 100 words within 30 minutes.';
        expect(instructionText).toContain(expectedText);
    }
    async verifyQuestionText() {
        const questionText = await this.questionBody.textContent();
        const expectedText = 'Describe and extract information from a source, such as a text or graphic, ensuring clarity and accuracy in your description.';
        expect(questionText).toContain(expectedText);
    }
    async verifyStudentResponseVisibleAndValid() {
        await this.userResponseTitle.scrollIntoViewIfNeeded();
        await expect(this.userResponseTitle).toBeVisible();
        const responseText = await this.userResponse.first().textContent();
        await expect(responseText).toBeTruthy();
        const wordCount = responseText.trim().split(/\s+/).length;
        console.log('Word Count:', wordCount);
        // expect(wordCount).toBeGreaterThan(100);
        expect(responseText.toLowerCase()).toContain('photosynthesis');
        expect(responseText.toLowerCase()).toContain('sunlight');
    }
    async verifyScoreWordCountAndTime() {
        await expect(this.predictedScore).toBeVisible();
        const scoreText = await this.predictedScore.textContent();
        const score = parseInt(scoreText?.match(/\d+/)?.[0], 10);
        expect(score).toBeGreaterThan(0);

        await expect(this.wordCount).toBeVisible();
        const wordCountText = await this.wordCount.textContent();
        const wordCount = parseInt(wordCountText?.match(/\d+/)?.[0], 10);
        expect(wordCount).toBeGreaterThan(90);

        await expect(this.complitionTime).toBeVisible();
        const timeText = await this.complitionTime.textContent();
        expect(timeText).toMatch('00 : 02 : 06');
    }
    async verifySuggestedResponse() {
        await this.suggestedResponse.scrollIntoViewIfNeeded();
        await expect(this.suggestedResponse).toBeVisible();
        await this.suggestedResponse.click();
        // await this.suggestedResponseContent.waitFor({ state: 'visible', timeout: 5000});
        const text = await this.suggestedResponseContent.textContent();
        console.log('Suggested text: ', text);
        expect(text.toLowerCase()).toContain('photosynthesis');
        expect(text.toLowerCase()).toContain('sunlight');
        expect(text.toLowerCase()).toContain('energy');
    }
    async editTransformedWriting() {
        await this.transformedWriting.click();
        await this.transformEditBtn.click();
        await this.richTextEditor.fill("This is a test for transformed writing....");
        await this.updateBtn.click();
        await this.page.waitForTimeout(5000);
        await this.cancelBtn.click();
    }
  
  };

module.exports = AssignmentDetailPage;


