const {test, expect, chromium} = require('@playwright/test');
const WritingQuestion = require('../pages/WritingQuestionPage')
const userData = require('../utils/userData');

test.describe('Writing question page', () => {
    let browser, context, page, writingQuestionPage;
    test.beforeAll(async () => {
        browser = await chromium.launch();
    })
    test.beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        writingQuestionPage = new WritingQuestion(page);
        await writingQuestionPage.navigate();
        await writingQuestionPage.login(userData.student.email, userData.student.password);
        await page.waitForURL('/dashboard');
        await writingQuestionPage.startToWriteEssay();
    })
    test.afterEach(async () => {
        await page.close();
        await context.close();
    })
    test.afterAll(async () => {
        await browser.close();
    })

    test('Verify page title and URL', async () => {
        await expect(page).toHaveTitle('Question & Writing - Writing-Aide')
        await expect(page).toHaveURL(/\/writing\/question\/\d+$/)
    })

    test('Verify question section element', async () => {
        await writingQuestionPage.verifyQuestionSection();
    })

    test('Verify start writing button works (activates timer)', async () => {
        const initialTime = await writingQuestionPage.countdown.textContent();
        // console.log('Initial Time: ', initialTime);
        expect(initialTime.trim()).toBe('00 : 20 : 00')
        
        await writingQuestionPage.activateEditor();

        await page.waitForTimeout(3000);

        const updatedTime = await writingQuestionPage.countdown.textContent();
        // console.log('Updated Time: ', updatedTime);
        expect(updatedTime.trim()).not.toBe('00 : 20 : 00')
    })

    test.skip('Verify word counter functionality', async () => {
        await writingQuestionPage.activateEditor();
        const sampleText = 'This is a test sentence with seven words';
        await writingQuestionPage.typeInEditor(sampleText);
        const wordCount = await writingQuestionPage.getWordCount();
        expect(wordCount).toBe(7);
    })

    test('Verify instruction and question content', async () => {
        await writingQuestionPage.verifyInstructionAndQuestion()
    })

   
})

const text = 'The bar chart illustrates the number of newly registered businesses in three European cities—Paris, Madrid, and London—between 2010 and 2020.' + 
'Overall, London consistently had the highest number of new business registrations over the period, while Madrid registered the lowest. Despite fluctuations,' +  
'all three cities showed an upward trend in business registrations by the end of the decade.' + 
'In 2010, London recorded around 6,000 new businesses, steadily rising to 10,000 by 2020. Paris began at approximately 4,500, experienced slight variations in ' + 
'the middle years, but ended strongly with about 7,500 registrations in 2020. Meanwhile, Madrid started at just under 3,000 and, despite minor dips in some years, gradually increased to nearly 5,000 by the end of the period.' + 
'By comparison, London maintained a clear lead in business activity throughout the decade, while Madrid lagged behind. Paris, though initially closer to Madrid,' + 
'eventually narrowed the gap with London, indicating stronger growth momentum in later years. '

// regresion test zamaninda skip kaldir
test.skip('Verify write the test and submit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(userData.admin.email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(userData.admin.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Get Started' }).click();
  await page.getByRole('button', { name: 'Task 1' }).click();
  await page.getByRole('link', { name: 'Submit / Start Writing' }).click();
  await page.getByRole('button', { name: 'Start Writing' }).click();
  await page.locator('.m_d37966d9').click();
  await page.getByRole('textbox', { name: 'Rich-Text Editor' }).getByRole('paragraph').click();
  await page.getByRole('textbox', { name: 'Rich-Text Editor' }).fill(text);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('.mantine-RichTextEditor-typographyStylesProvider').click({force: true});
  await page.getByRole('button', { name: 'Submit' }).click();

});