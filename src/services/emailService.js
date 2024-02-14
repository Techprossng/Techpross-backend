// @ts-check
const nodemailer = require("nodemailer");
const envConfigVars = require("../utils/envConfig");
const path = require("path");
const hbs = require('nodemailer-express-handlebars');



/**
 * ### Email service for confirmation of payments and registration notifications
 */
class EmailService {

    /**@private @readonly */
    static mailConfig = {
        MAIL_HOST: envConfigVars.MAIL_HOST,
        MAIL_PORT: envConfigVars.MAIL_PORT ?? '465',
        MAIL_ID: envConfigVars.MAIL_ID,
        MAIL_PASSWORD: envConfigVars.MAIL_PASSWORD
    };

    /**@private @readonly */
    static subjectCategory = {
        regConfirmation: "Welcome To TechProsNaija Career LaunchPad",
        paymentConfirmation: "TechProsNaija Career LaunchPad Payment Confirmation"
    }

    /**@private @readonly */
    static categories = ["payments", "registration"];

    static transporter = nodemailer.createTransport({
        host: EmailService.mailConfig.MAIL_HOST,
        port: parseInt(EmailService.mailConfig.MAIL_PORT, 10),
        secure: true, // use TLS
        auth: {
            user: EmailService.mailConfig.MAIL_ID,
            pass: EmailService.mailConfig.MAIL_PASSWORD
        },
        pool: true, // set up pooled connections against SMTP server on port 465
        maxConnections: 20 // maximum simultaneous connections to make
    });

    /**
     * ### gets the handlebar config based on the email category
     * @param {string} category 
     */
    static getHandlebarConfig(category) {
        const viewPath = category === "registration" ? "registration" : "payments";

        /**@type {hbs.NodemailerExpressHandlebarsOptions} */
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve(__dirname, `../views/${viewPath}`),
                defaultLayout: ''
            },
            viewPath: path.resolve(__dirname, `../views/${viewPath}`),
        }
        return handlebarOptions;
    }

    /**
     * Send email to the `userEmail` client with a defined category
     * @param {string} userEmail Email recipent
     * @param {string} userFirstName The user firstName to be included in the email
     * @param {string} category category of email to be Sent
     * @returns {Promise<string | null>}
     */
    static async sendMail(userEmail, userFirstName, category) {
        try {
            const handlebarOptions = this.getHandlebarConfig(category);

            EmailService.transporter.use('compile', hbs(handlebarOptions));

            /**@type {nodemailer.SendMailOptions} */
            const mailOptions = {
                from: this.mailConfig.MAIL_ID,
                to: userEmail,
                subject: category === "registration" ?
                    this.subjectCategory.regConfirmation
                    : this.subjectCategory.paymentConfirmation,
                template: category === "registration" ? "welcome" : "payment",
                context: {
                    name: userFirstName,
                }
            }

            const mailSentResponse = await EmailService.transporter.sendMail(mailOptions);

            console.log(`confirmation mail sent!: ${mailSentResponse.response}`);

            if (mailSentResponse) {
                return mailSentResponse.response;
            } else {
                throw new Error(`An error occured. ${category} mail not sent`);
            }

        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = EmailService;