// @ts-check

const Payer = require('../models/Payer');
const RemitaPaymentService = require('./RemitaPayment.service');

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */



class PayerController {

    /**
     * add a payee information
     * @type {Handler}
     */
    static async addPayer(request, response) {
        // get payer object from previous middleware
        const payer = response.locals.payer;

        try {
            const savedPayer = await Payer.addPayer(payer);
            return response.status(201).json({ message: "success", payer: savedPayer })

        } catch (error) {
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * ### Gets a payer
     * @type {Handler}
     */
    static async getPayer(request, response) {
        const payer = response.locals.payer;

        try {
            const returnData = { message: 'success', payer: { ...payer } };
            return response.status(200).json(returnData);
        } catch (error) {
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * ### updates the payment status of a payer if for some reason the webhook listener
     * ### does not.
     * - Only remita-confirmed successful payments can be updated
     * - Uses the `RemitaPaymentService` class to perform abstracted checks
     * - Remita Retrieval Reference, `RRR` is needed in the request body
     * @type {Handler}
     */
    static async updatePayerStatus(request, response) {
        const { id } = request.params;
        const { RRR } = request.body;

        const payerId = parseInt(id, 10);
        const updateError = "Cannot update payer's status";



        try {
            // check payment status by the Remita Retrieval Reference
            const remitaResponse = await RemitaPaymentService.checkPaymentStatusWithRRR(RRR);

            if (remitaResponse !== 'Transaction Successful') {
                return response.status(400).json({
                    error: updateError, RemitaError: remitaResponse
                });
            }
            await Payer.updatePayer(payerId);

            const returnData = { message: 'Payment status updated successfully', id: payerId };
            return response.status(200).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = PayerController;