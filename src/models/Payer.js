// @ts-check
const { db, TABLES } = require('../db');
const { Util } = require('../utils/index');

/**
 * @typedef {object} TPayer
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} course
 * 
 * @typedef {object} TUpdate
 * @property {string} payerRRR
 * @property {boolean} isPaid
 */

/** ## Payment class for mysql database actions */
class Payer {

    /**@private @readonly */
    static selectFields = [
        'id', 'firstName', 'lastName',
        'email', 'course',
        'isPaid', 'payerRRR'
    ];

    /**@private @readonly */
    static pageLimit = 20;

    /**
     * ### Adds a payee to the database
     * @param {TPayer} payer
     */
    static async addPayer(payer) {
        try {
            const [id] = await db(TABLES.PAYERS)
                .insert({ ...payer });

            return {
                id: id,
                ...payer
            }
        } catch (error) {
            throw new Error('Could not add payee')
        }
    }

    /**
     * retrieves a payee resource
     * @param {string} payerEmail 
     * @returns {Promise<object | null>} a payee resource
     */
    static async getPayerByEmail(payerEmail) {
        try {
            const payer = await db(TABLES.PAYERS)
                .where({ email: payerEmail }).first();

            if (!payer) {
                return null;
            }
            return Object.assign({}, payer);
        } catch (error) {
            throw new Error('Could not get payer');
        }
    }

    /**
     * retrieves a payee resource
     * @param {number} payerId 
     * @returns {Promise<object | null>} a payee resource
     */
    static async getPayerById(payerId) {
        try {
            const payer = await db(TABLES.PAYERS)
                .where({ id: payerId }).first();

            if (!payer) {
                return null;
            }
            return Object.assign({}, payer);
        } catch (error) {
            throw new Error('Could not get payer');
        }
    }

    /**
     * retrieves all payees by page
     * @param {number} pageNum 
     * @returns {Promise<object>} contains payees data by page and
     * next page number 
     */
    static async getAllPayers(pageNum = 1) {

        // get offset for pagination
        const offset = Util.getOffset(pageNum, this.pageLimit);
        try {
            const allPayees = await db(TABLES.PAYERS)
                .select(...this.selectFields)
                .limit(this.pageLimit)
                .offset(offset)
                .orderBy('id')

            if (!allPayees) {
                return { payers: [], nextPageNum: null };
            }

            // set new offset and get next page number
            const newOffset = this.pageLimit + offset;
            const nextPageNum = await Util.
                getNextPage(newOffset, this.pageLimit, TABLES.PAYERS);

            // cleanup object. knex returns RowData {}, assign to readable object
            const payers = allPayees.map(payer => Object.assign({}, payer));

            return { payers, nextPageNum };

        } catch (error) {
            throw new Error(`Could not get payees for ${pageNum}`);
        }
    }

    /**
     * ### Updates a payer's payment status
     * @param {number} payerId
     * @param {TUpdate} updateData
     * @returns {Promise<boolean>}
     */
    static async updatePayerById(payerId, updateData) {

        try {
            await db(TABLES.PAYERS)
                .where({ id: payerId })
                .update({ ...updateData })

            return true;

        } catch (error) {
            throw new Error('Unable to update');
        }
    }

    /**
     * ### Updates a payer's payment status
     * @param {number} payerEmail
     * @param {TUpdate} updateData 
     * @returns {Promise<boolean>}
     */
    static async updatePayerByEmail(payerEmail, updateData) {

        try {
            await db(TABLES.PAYERS)
                .where({ email: payerEmail })
                .update({ ...updateData })

            return true;

        } catch (error) {
            throw new Error('Unable to update');
        }
    }

}

module.exports = Payer;