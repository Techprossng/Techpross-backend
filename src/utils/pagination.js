//@ts-check
const { db } = require('../db');


/**
 * computes the number of items to skip for pagination
 * @param {number} pageNum 
 * @param {number} pageLimit 
 * @returns {number}
 */
const getOffset = (pageNum, pageLimit) => {
    return (pageNum - 1) * pageLimit;
}

/**
 * Computes the number of rows on a table
 * @param {string} tableName name of table rows to be counted 
 * @returns {Promise<number | string>}
 */
const getCountTableRows = async (tableName) => {

    const memoizedObj = {};

    const tableCount = `${tableName}Count`;

    if (!memoizedObj.tableCount) {
        const [result] = await db(tableName)
            .count('id', { as: 'rowsCount' })

        memoizedObj[tableCount] = result.rowsCount;

        return memoizedObj[tableCount];
    }

    return memoizedObj[tableCount];

}

/**
 * @async
 * computes the next number of rows in `table` for the next page
 * for pagination
 * @param {number} offset new offset for requested page
 * @param {number} pageLimit
 * @param {string} table table to be queried
 * @returns {Promise<number | null>} next page number
 */
const getNextPage = async (offset, pageLimit, table) => {
    /**@type {number | null} */
    let nextPageNum = null;
    /** @type {number} */

    let rowsCount;

    // get rows count for table

    const totalRowsCount = await getCountTableRows(table);
    if (typeof totalRowsCount === 'string') {
        rowsCount = parseInt(totalRowsCount, 10);
    } else {
        rowsCount = totalRowsCount;
    }

    // resources count in previous pages
    const itemsRendered = offset - pageLimit;

    // amount of resources unrendered
    const remainder = rowsCount - (itemsRendered + pageLimit);

    // no more resources to fetch
    if (remainder <= 0) {
        return nextPageNum;
    }

    // compute next page number
    nextPageNum = (offset / pageLimit) + 1;

    return nextPageNum;

}

module.exports = {
    getOffset, getNextPage
}