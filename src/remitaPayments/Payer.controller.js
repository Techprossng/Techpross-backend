// @ts-check

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
    static async addPayee(request, response) { }

    static async getPayeeByEmail(request, response) { }

    static async getPayeeById(request, response) { }
}

module.exports = PayerController;