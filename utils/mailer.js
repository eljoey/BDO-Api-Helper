const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const { EMAIL, EMAIL_PASSWORD, MAIN_URL } = require('./config');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});

const MailGenerator = new Mailgen({
    theme: 'cerberus',
    product: {
        name: 'BDO-Stuff',
        link: MAIN_URL
    }
});

const sendAlert = (username, userEmail, alert, itemName) => {
    const response = {
        body: {
            name: username,
            intro: `Your alert '${alert}' for ${itemName} has been met.`,
            action: {
                instructions: 'This alert has been set to inactive.  You can activate it whenever from your alerts page.',
                button: {
                    color: '#3fa3c4',
                    text: 'BDO-Stuff',
                    link: 'https://bdo-stuff.netlify.app/'
                }
            }

        }
    };

    const mail = MailGenerator.generate(response);

    const message = {
        from: EMAIL,
        to: userEmail,
        subject: 'Alert triggered',
        html: mail
    };

    transporter.sendMail(message);
};

module.exports = {
    sendAlert
};
