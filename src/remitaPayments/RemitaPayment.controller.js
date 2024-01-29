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
     */
    // static async receivePaymentNotification(request, response) {
    //     return;
    // }

    /**
     * ### gets remita secret key for payment transactions
     * @type {Handler}
     */
    static async getRemitaSecretKey(request, response) {

        return response.status(200).json({ ...this.apiObject });
    }
}

module.exports = RemitaPaymentController;
