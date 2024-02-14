// @ts-check

const axios = require('axios').default;
const { createHash } = require('node:crypto');
const envConfigVars = require('../utils/envConfig');

// @ts-ignore
require('dotenv').config();


// PLEASE READ!!

/**
 * This is the remita payment service module. The webhook in the router module
 * has been registered with remita and should not be altered, changed, or tampered with.
 * If alteration is neccessary, please contact the company's COO or CTO.
 * 
 * STATUS CODES USED:
 * 
 * - 00: successful payment
 * - 012: Aborted transaction
 * - 02: Transaction failed
 * - 021: Transaction pending
 */



/**
 * ## Remita Payment service class
 */
class RemitaPaymentService {

    /**@private @readonly */

    /**@private @readonly */
    static apiObject = {
        merchantId: envConfigVars.REMITA_MERCHANT_ID,
        apiKey: envConfigVars.REMITA_API_KEY,
        demoUrl: envConfigVars.REMITA_DEMO_URL,
        liveURL: envConfigVars.REMITA_LIVE_URL,
        environment: envConfigVars.ENV
    };

    /**
     * hashes a string with sha512 algorithm
     * @param {string} stringToHash 
     * @returns {Promise<string>} apiHash
     */
    static createApiHash(stringToHash) {
        return new Promise((resolve, reject) => {
            try {
                const apiHash = createHash('sha512')
                    .update(stringToHash, 'utf8')
                    .digest('hex');
                resolve(apiHash);
            } catch (error) {
                reject('Could not create hash');
            }
        });
    }

    /**
     * ### Confirms the payment made by the payee from remita
     * - listens for a webhook notification from remita
     * - confirms the user payment and returns a boolean
     * 
     * @returns {Promise<boolean>}
     */
    static async confirmPaymentFromRemita() { return false; }

    /**
     * ### Checks the user transaction status with RRR
     * @param {string} rrr 
     * 
     * @returns {Promise<string>}
     */
    static async checkPaymentStatusWithRRR(rrr) {

        try {
            const { merchantId, apiKey, liveURL, demoUrl, environment } = this.apiObject;
            const useUrl = environment === "development" || environment === "test"
                ? demoUrl : liveURL;

            const stringToHash = rrr + apiKey + merchantId; // RRR + apiKey + merchantId
            const apiHash = await this.createApiHash(stringToHash);

            const config = {
                method: 'get',
                url: `${useUrl}/${rrr}/${apiHash}/status.reg`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `remitaConsumerKey=2547916,remitaConsumerToken=${apiHash}`
                }
            }
            const response = await axios(config);

            const { status, message } = response.data;

            const generatedMessage = this.getStatusMessage(status);

            return !generatedMessage.length ? message : generatedMessage;

        } catch (error) {
            if (error.name === 'AxiosError') {
                throw new Error(`Error with Axios, ${error.message}`);
            }
            throw new Error('Error with Server');
        }

    }


    /**
     * ### Get status message
     * @param {string} remitaStatusCode 
     * @returns {string}
     */
    static getStatusMessage(remitaStatusCode) {

        if (!remitaStatusCode) {
            return '';
        }

        switch (remitaStatusCode) {
            case '022':
                return 'Invalid RRR';
            case '012':
                return 'Aborted Transaction';
            case '013':
                return 'Invalid Hash Value';
            case '02':
                return 'Transaction Failed';
            case '021':
                return 'Transaction Pending';
            case '023':
                return 'Invalid MerchantId Or OrderId';
            case '030':
                return 'Insufficient Funds';
            case '00':
                return 'Transaction Successful';
            default:
                return ''
        }
    }
}

module.exports = RemitaPaymentService;