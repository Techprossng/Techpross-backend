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

        const { payerEmail } = remitaNotification;

        // check payer's data and update payment status
        const payer = await Payer.getPayerByEmail(payerEmail);

        // Send the response to remita even if payer is not seeded in the database
        if (!payer) {
            return response.status(200).send('Ok');
        }

        // update payer's payment status
        await Payer.updatePayerByEmail(payerEmail, true);

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
