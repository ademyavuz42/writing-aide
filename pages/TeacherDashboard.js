const LoginPage = require('./LoginPage');

class TeacherDashBoard extends LoginPage{
    constructor(page){
    super(page);
    this.page = page;
    this.welcomeMessage = page.getByRole('heading', { name: 'Welcome, '});
    this.headingTaskAssignment = page.getByRole('heading', { name: 'Task Assignments'});
    this.assignTaskButton = page.getByRole('button', { name: 'Assign Task'});
    this.roleDefault = page.getByRole('button', { name: 'PERSONAL' })
    this.rolePersonal = page.getByRole('menuitem', { name: 'PERSONAL' });
    this.roleAdmin = page.getByRole('menuitem', { name: 'ADMIN' });
    this.roleTeacher = page.getByRole('menuitem', { name: 'TEACHER' });
    this.navTeachersDashboardLink = page.getByRole('link', { name: "Teacher/'s Dashboard" });
    this.navMyStudentsLink = page.getByRole('link', { name: 'My Students' });
    this.navAssignmentsLink = page.getByRole('link', { name: 'Assignments' });
    this.navGradesLink = page.getByRole('link', { name: 'Grades' });
    this.classCard = page.getByText('Classes', { exact: true })
    this.studentsCard = page.getByText('Students', { exact: true })
    this.testsCard = page.getByText('Tests', { exact: true })
    this.classCardTitle = page.locator('.__m__-rbn7 p');

    }

    async changeRole(role){
        await this.roleDefault.click();
        await this.page.getByRole('menuitem', { name: role}).click();
    }

    async getWelcomeText() {
        const text = await this.welcomeMessage.innerText();
        return text;
    }

    async getByText(text){
        const locator = this.page.getByText(text, { exact: true});
        return await locator.texContent();
    }

}

module.exports = TeacherDashBoard;