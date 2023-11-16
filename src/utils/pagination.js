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
 * @async
 * computes the next number of rows in `table` for the next page
 * for pagination
 * @param {number} offset
 * @param {number} pageLimit
 * @param {string} table table to be queried
 * @returns {Promise<number | null>} next page number
 */
const getNextPage = async (offset, pageLimit, table) => {
    /**@type {number | null} */
    let nextPageNum = null;
    /** @type {number} */
    let nextPageCount;

    // get rows count for next page
    // { rowsCount: number } is returned
    const [nextPage] = await db(table)
        .count('id as rowsCount')
        .limit(pageLimit)
        .offset(offset)

    // no next rows
    if (!nextPage) {
        return nextPageNum;
    }

    const { rowsCount } = nextPage;
    // parse string type
    if (typeof rowsCount === 'string') {
        nextPageCount = parseInt(rowsCount, 10);
    } else {
        nextPageCount = rowsCount;
    }

    // compute next page number
    nextPageNum = nextPageCount > 0 ? (offset / pageLimit) + 1 : 0;

    return nextPageNum;

}

module.exports = {
    getOffset, getNextPage
}