//@ts-check
const { db, TABLES } = require('../db');
const { Util } = require('../utils');


class Subscriber {
  /**@private @readonly */
  static pageLimit = 20;

  /**
   * @async
   * creates a new subscriber
   * @param {string} email
   * @returns {Promise<object>} containing userId and email
   * @throws {Error} if subscriber can't be created
   */
  static async addSubscriber(email) {

    try {
      const [id] = await db(TABLES.SUBSCRIBERS)
        .insert({ email: email });
      return { id, email };

    } catch (error) {
      throw new Error('could not create subscriber');
    }
  }

  /**
   * @async
   * Gets a subscriber by id
   * @param {string} subscriberEmail
   * @returns {Promise<object | null>} containing id and email
   */
  static async getSubscriberByEmail(subscriberEmail) {

    try {
      const subscriber = await db(TABLES.SUBSCRIBERS)
        .where({ email: subscriberEmail }).first();

      if (!subscriber) {
        return null
      }
      return Object.assign({}, subscriber);
    } catch (error) {
      throw new Error('Could not get subscriber');
    }
  }

  /**
   * @async
   * Gets a subscriber by id
   * @param {number} subscriberId
   * @returns {Promise<object | null>} containing id and email
   */
  static async getSubscriberById(subscriberId) {

    try {
      const subscriber = await db(TABLES.SUBSCRIBERS)
        .where({ id: subscriberId }).first();

      if (!subscriber) {
        return null
      }
      return Object.assign({}, subscriber);
    } catch (error) {
      throw new Error('Could not get subscriber');
    }
  }

  /**
   * retrieves all subscribers by page
   * @param {number} pageNum 
   * @returns {Promise<object>} contains subscribers data by page and
   * next page number 
   */
  static async getAllSubscribers(pageNum = 1) {
    // get offset for pagination
    const offset = Util.getOffset(pageNum, this.pageLimit);
    try {
      const allSubscribers = await db(TABLES.SUBSCRIBERS)
        .select('id', 'email')
        .limit(this.pageLimit)
        .offset(offset)
        .orderBy('id')

      if (!allSubscribers) {
        return { data: [], nextPageNum: null };
      }

      // set new offset and get next page number
      const newOffset = this.pageLimit + offset;

      const nextPageNum = await Util.
        getNextPage(newOffset, this.pageLimit, TABLES.SUBSCRIBERS);

      // cleanup object. knex returns RowData {}, set to pure object
      const subscribers = allSubscribers.map(subscriber => {
        const subscriberObj = Object.assign({}, subscriber);
        return subscriberObj;
      });

      return { subscribers, nextPageNum };

    } catch (error) {
      throw new Error(`Could not get subscribers for ${pageNum}`);
    }
  }

  /**
   * @async
   * deletes a subscriber.
   * @param {string} subscriberEmail 
   * @returns {Promise<boolean>}
   */
  static async deleteByEmail(subscriberEmail) {
    try {
      await db(TABLES.SUBSCRIBERS)
        .where({ email: subscriberEmail })
        .del()
      return true;
    } catch (error) {
      throw new Error('Could not delete subscriber');
    }
  }

  /**
   * @async
   * deletes a subscriber.
   * @param {number} subscriberId
   * @returns {Promise<boolean>}
   */
  static async deleteById(subscriberId) {
    try {
      await db(TABLES.SUBSCRIBERS)
        .where({ id: subscriberId })
        .del()
      return true;
    } catch (error) {
      throw new Error('Could not delete subscriber');
    }
  }
}

module.exports = Subscriber;
