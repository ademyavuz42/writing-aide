const messages = {
    email: {
        missingAt:  "Please include an '@' in the email address. 'invalidEmail.com' is missing an '@'.",
        missingDomain: "Please enter a part following '@'. 'invalid@' is incomplete.",
        invalidEmail: 'Invalid email or password'
    },
    password: {
        missingPassword: 'Please fill out this field.',
        shortPassword: 'Password must be at least 6 characters long.',
        incorrectPassword: 'Invalid email or password'
    },
    login: {
        success: 'Login successful.'
    }
};
module.exports = messages;