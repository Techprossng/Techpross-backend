// @ts-check

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

class RemitaPaymentController {

    /**
     * add a payee information
     * @type {Handler}
     */
    static async checkPaymentStatusWithRRR(request, response) {
        return;
    }

    /**
     * ### Listens to remita webhook for payment notifications and updates payer's info
     */
    static async receivePaymentNotification(request, response) {
        return;
    }

    /**
     * ### gets remita secret key for payment transactions
     */
    static async getRemitaSecretKey(request, response) {
        // check authorization header
        // deliver key
    }
}

module.exports = RemitaPaymentController;
