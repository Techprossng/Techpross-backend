// @ts-check
const amqp = require('amqplib/callback_api');
const envConfigVars = require("../utils/envConfig");
const EmailService = require('../services/emailService');


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

                // Topics in rabbitmq are much more viable here. This option
                // of concatenating the userEmail, userFirstName and category is a simple
                // but hard-coded
                channel.sendToQueue(queue, Buffer.from(`${userEmail} ${userFirstName} ${category}`), {
                    persistent: true
                });
                console.log("[x] Sent %s", userEmail);

            });
            // Close connection
            setTimeout(() => {
                connection.close();
            }, 35000);
        });
    }

    /**
     * ### starts the rabbitmq email worker
     */
    static async startEmailWorker() {
        amqp.connect(envConfigVars.AMQP_URL, (error, connection) => {
            if (error) {
                throw error;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                const queue = 'support_email_queue';

                // makes sure the queue exists before attempting to consume from it
                channel.assertQueue(queue, { durable: true });

                // will not consume more than one message at a time 
                channel.prefetch(1);
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, async (messageFromQueue) => {

                    if (!messageFromQueue) {
                        return;
                    }
                    const mailResponse = await this.processEmailQueue(messageFromQueue);

                    if (mailResponse) {
                        channel.ack(messageFromQueue);
                    }
                }, {
                    // manual acknowledgement
                    noAck: false
                });
            });

        });
    }

    /**
     * callback to process email queue
     * @param {amqp.Message | null} messageFromQueue
     */
    static async processEmailQueue(messageFromQueue) {
        if (!messageFromQueue) {
            return;
        }
        const [userEmail, userFirstName, category] = messageFromQueue.content.toString().split(" ");

        const mailResponse = await EmailService.sendMail(userEmail, userFirstName, category);

        return mailResponse;

    }

}

module.exports = BrokerService;