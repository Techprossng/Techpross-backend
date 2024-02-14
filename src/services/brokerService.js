// @ts-check
const amqp = require('amqplib/callback_api');
const envConfigVars = require("../utils/envConfig");


class BrokerService {

    /**
     * ### Sends a user email to the queue to be processed
     * @param {string} userEmail
     * @param {string} userFirstName
     * @param {string} category email category
     */
    static async sendToEmailQueue(userEmail, userFirstName, category) {
        amqp.connect(envConfigVars.AMQP_URL, (error, connection) => {
            if (error) {
                throw error;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                const queue = 'support_email_queue';

                channel.assertQueue(queue, { durable: true });

                // Topics in rabbitmq are much more vaible here. This option
                // of concatenating the userEmail and category is a simple hard-coded way
                channel.sendToQueue(queue, Buffer.from(`${userEmail} ${category} ${userFirstName}`), {
                    persistent: true
                });
                console.log("[x] Sent %s", userEmail);

            });
            setTimeout(() => {
                connection.close();
                process.exit(0);
            }, 35000);
        });
    }
}

module.exports = BrokerService;