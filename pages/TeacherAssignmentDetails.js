const TeacherAssignment = require('./TeacherAssignment');

class TaecherAssignmentDetails extends TeacherAssignment{
    constructor(page){
        super(page);
        this.page = page;
        this.backBtn = page.getByRole('link', { name: 'Back' });
        this.assinmentsLink = page.getByRole('link', { name: 'Assignments' });
        this.headingTitle = page.locator('main h3');
        this.creationDate = page.locator('main div:has-text("Created at :") >> p').nth(1)
        this.deadlineDate = page.locator('main div:has-text("Deadline :") >> p').nth(1)
        this.writingExamType = page.locator('#writingExamType span');
        this.status = page.locator('main div:has-text("Status :")').last();
        this.totalRecipients = page.locator('main div:has-text("Total Recipients :") >> p').nth(1);  
        this.submittedUsers = page.locator('main div:has-text("Submitted :") >> p').nth(1);
        this.modifyBtn = page.locator('#actionTo-ModifyTask');
        this.modalSection = page.locator('section[role="dialog"]');
        this.formInModal = this.modalSection.locator('form');
    }


}

module.exports = TaecherAssignmentDetails;