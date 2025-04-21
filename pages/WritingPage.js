const { expect } = require('@playwright/test');
const LoginPage = require('./LoginPage');

class WritingPage extends LoginPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.writingsLink = page.getByRole('link', { name: 'Writings' });
        this.pageTitle = page.locator('main h2');
        this.sortDateBtn = page.getByRole('button', { name: 'Date' });
        this.writingDate = page.locator('p#writingDate');
        this.complitionTime = page.locator('p#completionTime');
        this.writingTest = page.locator('div#writingTest span');
        this.writingScoreRange = page.locator('#writingScoreRange span');
        this.detailButton = page.locator('a[id^="navigationOther-Detail-"]');
        this.startNewWritingBtn = page.locator('#navigationOther-startWriting')
        this.deleteBtn = page.getByRole('button', { name: 'Delete' });
        this.reviewBtn = page.getByRole('button', { name: 'Rating & Review' });
        this.feedbackModal = page.locator('div[rile="dialog"]');
    }
   async verifyMainComponentsVisible() {
    await this.pageTitle.isVisible();
    await this.sortDateBtn.isVisible();
   }
   async verifyWritingComponentsVisible() {
    await this.writingDate.first().isVisible();
    await this.complitionTime.first().isVisible();
    await this.writingTest.first().isVisible();
    await this.writingScoreRange.first().isVisible();
    await this.detailButton.first().isVisible();
   }
  async verifyStartNewWritingBtn() {
    await this.startNewWritingBtn.isVisible();
    await this.startNewWritingBtn.click();
  }
  async clickSortByDate() {
    await this.sortDateBtn.isVisible();
    await this.sortDateBtn.click();
  }
  async getWritingDates() {
    const dates = await this.writingDate.allTextContents();
    return dates.map(date => new Date(date.trim()));
  }
  async verifyEachWritingEntry() {
    const count = await this.writingDate.count();
    console.log(`Writing entries count: ${count}`);
    for (let i = 0; i < count; i++) {
      await this.writingDate.nth(i).isVisible();
      await this.complitionTime.nth(i).isVisible();
      await this.writingTest.nth(i).isVisible();
      await this.writingScoreRange.nth(i).isVisible();
      await this.detailButton.nth(i).isVisible();
    }
  }
  async verifyEachDetailButtonClickable() {
    const count = await this.writingDate.count();
    for (let i = 0; i < count; i++) {
      await this.detailButton.nth(i).isEnabled();
    }
  }
  async clickDetailButtonAndVerifyRedirection(index) {
    const detailBtn = await this.detailButton.nth(index);
    const href = await detailBtn.getAttribute('href');
    console.log(`Detail button ${index + 1} href: ${href}`)
    await detailBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page).toHaveURL(new RegExp(`${href}`));
  }
  async clickDeleteButtonAndVerifyPopup() {
    const deleteButton = await this.deleteBtn.first();
    await deleteButton.isVisible();
    await deleteButton.isEnabled();
    await deleteButton.click();
    await this.page.once('dialog', async (dialog) => {
      console.log(`Dialog meesage: ${dialog.message()}`);
      expect(dialog.message().toLowerCase()).toContain('are you sure');
      await dialog.dismiss();
      console.log('Dialog dismissed');
    })
  }

    
}

module.exports = WritingPage;