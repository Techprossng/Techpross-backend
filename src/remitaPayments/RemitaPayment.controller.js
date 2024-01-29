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
    static async checkPaymentStatusWithRRR(request, response) { }

    static async receivePaymentNotification(request, response) { }
}

module.exports = RemitaPaymentController;
