const Payer = require('../models/Payer');
const RemitaPaymentService = require('./RemitaPayment.service');

// @ts-check
require('dotenv').config();

const {
    REMITA_PUBLIC_KEY,
    REMITA_SECRET_KEY,
} = process.env;

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

class RemitaPaymentController {

    /**@private @readonly */
    static apiObject = {
        publicKey: REMITA_PUBLIC_KEY,
        secretKey: REMITA_SECRET_KEY,
    };

    /**
     * ### Generates a Remita Retrieval Reference for a payer and gets
     * ### remita secret key for payment transactions
     * @type {Handler} 
     */
    static async generateRRRForPayment(request, response) {
        const amount = request.query.amount;

        // get payer info/object for previous handler
        const payer = response.locals.payer;

        try {
            const dataForPayment = {
                name: payer.firstName + ' ' + payer.lastName,
                email: payer.email, payerId: payer.id
            }

            const amountInt = Number(amount);

            const generatedRRR = await RemitaPaymentService.generateRRR(amountInt, dataForPayment);

            if (!generatedRRR) {
                return response.status(400).json({ error: 'RRR could not be generated. Bad Gateway' });
            }

            // update payer info
            // @ts-ignore
            await Payer.updatePayerById(payer.id, { payerRRR: generatedRRR });

            const dataToReturn = {
                message: 'success', ...RemitaPaymentController.apiObject,
                RRR: generatedRRR, amount: amount
            };

            return response.status(200).json(dataToReturn);
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }


    }

    /**
     * add a payee information
     * @type {Handler}
     */
    static async checkPaymentStatusWithRRR(request, response) {
        const { RRR } = request.params;

        if (!RRR) {
            return response.status(400).json({ error: "Missing Remita Retrieval Reference" });
        }

        try {
            // check payment status by the Remita Retrieval Reference
            const remitaResponse = await RemitaPaymentService.checkPaymentStatusWithRRR(RRR);

            return response.status(200).json({
                message: "Request successful", remitaMessage: remitaResponse
            });

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * ### Listens to remita webhook for payment notifications and updates payer's info
     * @type {Handler}
     */
    static async receivePaymentNotification(request, response) {
        // A payment notification is an array object
        /**@type {Array<Record<string, any>>} */
        const [remitaNotification] = request.body;

        const { payerEmail, rrr } = remitaNotification;

        // check payer's data and update payment status
        const payer = await Payer.getPayerByEmail(payerEmail);

        // Send the response to remita even if payer is not seeded in the database
        if (!payer) {
            return response.status(200).send('Ok');
        }

        /** @type {string} */
        const payerRRR = rrr.indexOf("-") === -1 ? rrr : rrr.replace(/-/g, "");

        // update payer's payment status
        const updateData = { payerRRR, isPaid: true };

        await Payer.updatePayerByEmail(payerEmail, updateData);

        return response.status(200).send('Ok');
    }

    /**
     * ### gets remita secret key for payment transactions
     * @type {Handler}
     */
    static async getRemitaSecretKey(request, response) {

        return response.status(200).json({ message: 'success', ...RemitaPaymentController.apiObject });
    }
}

module.exports = RemitaPaymentController;
