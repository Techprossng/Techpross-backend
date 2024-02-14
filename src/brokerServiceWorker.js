// @ts-check
const amqp = require('amqplib/callback_api');
const envConfigVars = require("./utils/envConfig");
const EmailService = require('./services/emailService');


/**
 * callback to process email queue
 * @param {amqp.Message | null} messageFromQueue
 */
async function processEmailQueue(messageFromQueue) {
    if (!messageFromQueue) {
        return;
    }
    const [userEmail, userFirstName, category,] = messageFromQueue.content.toString().split(" ");

    const mailResponse = await EmailService.sendMail(userEmail, userFirstName, category);

    return mailResponse;

}


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
            const mailResponse = await processEmailQueue(messageFromQueue);

            if (mailResponse) {
                channel.ack(messageFromQueue);
            }

            setTimeout(() => {
                console.log("[x] Done");
                channel.ack(messageFromQueue);
            }, 10 * 1000);
        }, {
            // manual acknowledgement
            noAck: false
        });
    });

});