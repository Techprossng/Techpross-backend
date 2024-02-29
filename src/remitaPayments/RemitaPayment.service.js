// @ts-check

const axios = require('axios').default;
const { createHash } = require('node:crypto');
const envConfigVars = require('../utils/envConfig');

// @ts-ignore
require('dotenv').config();


/**
 * @typedef {object} IRemitaUser
 * @prop {string} name
 * @prop {string} email
 */


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
    static apiObject = {
        merchantId: envConfigVars.REMITA_MERCHANT_ID,
        apiKey: envConfigVars.REMITA_API_KEY,
        demoUrl: envConfigVars.REMITA_DEMO_URL,
        liveURL: envConfigVars.REMITA_LIVE_URL,
        generateRRRDemo: {
            url: envConfigVars.REMITA_GENERATE_RRR_URL_DEMO,
            merchantId: envConfigVars.REMITA_MERCHANT_ID,
            serviceTypeId: envConfigVars.REMITA_SERVICE_TYPE_ID,
            apiKey: envConfigVars.REMITA_API_KEY
        },
        generateRRRLive: {
            url: envConfigVars.REMITA_GENERATE_RRR_URL_LIVE,
            merchantId: envConfigVars.REMITA_MERCHANT_ID_LIVE,
            serviceTypeId: envConfigVars.REMITA_SERVICE_TYPE_ID_LIVE,
            apiKey: envConfigVars.REMITA_API_KEY_LIVE
        },
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
            const { liveURL, demoUrl, environment } = this.apiObject;

            const { merchantId, apiKey } = environment === "development" || environment === "test"
                ? this.apiObject.generateRRRDemo : this.apiObject.generateRRRLive;

            const useUrl = environment === "development" || environment === "test"
                ? demoUrl : liveURL;

            const stringToHash = rrr + apiKey + merchantId; // RRR + apiKey + merchantId
            const apiHash = await this.createApiHash(stringToHash);

            const config = {
                method: 'get',
                url: `${useUrl}/${rrr}/${apiHash}/status.reg`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`
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
     * ### Genrates RRR for remita payment
     * @param {number} paymentAmount
     * @param {IRemitaUser} payer - used as the orderId
     * @returns {Promise<string | null>} The remita generated RRR
     */
    static async generateRRR(paymentAmount, payer) {
        const { environment } = this.apiObject;
        const { name, email } = payer;

        try {
            const { merchantId, serviceTypeId, apiKey, url } = environment === "development"
                || environment === "test"
                ? this.apiObject.generateRRRDemo : this.apiObject.generateRRRLive;


            // generate orderId with date
            const currentDate = new Date();
            const orderId = currentDate.getTime();
            // @ts-ignore
            const stringToHash = merchantId + serviceTypeId + orderId + paymentAmount + apiKey;

            const apiHash = await this.createApiHash(stringToHash);

            /**@type {import('axios').AxiosRequestConfig} */
            const config = {
                method: 'post',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`
                },
                data: JSON.stringify({
                    serviceTypeId: serviceTypeId, amount: paymentAmount,
                    orderId: orderId, payerName: name, payerEmail: email,
                    description: 'TechProsNaija payment'
                }),
            }

            const response = await axios(config);

            // check for jsonp
            const data = response.data;
            let remitaData;

            if (typeof data === 'string') {

                // jsonp (json padding) is a string: 'jsonp ({ data: value })'
                // get the object and parse
                const [jsonStartIndex, jsonEndIndex] = [data.indexOf('{'), data.lastIndexOf('}')];

                const jsonString = data.substring(jsonStartIndex, jsonEndIndex + 1);

                remitaData = JSON.parse(jsonString);

            } else {
                remitaData = data;
            }

            // remitaData = data;
            const { status, RRR } = remitaData;

            if (!RRR || status !== 'Payment Reference generated') {
                return null
            }

            return RRR;

        } catch (error) {
            console.error(error);
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
            case '025':
                return 'Payment Reference generated';
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