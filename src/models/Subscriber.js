const { db, TABLES } = require('../db');


class Subscriber {
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
   * @returns {Promise<object> | null} containing id and email
   */
  static async getSubscriberByEmail(subscriberEmail) {

    try {
      const subscriber = await db(TABLES.SUBSCRIBERS)
        .select('id', 'email')
        .where({ email: subscriberEmail });
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
   * deletes a subscriber.
   * @param {string} subscriberEmail 
   * @returns {Promise<boolean>}
   */
  static async deleteSubscriber(subscriberEmail) {
    try {
      await db(TABLES.SUBSCRIBERS)
        .where({ email: subscriberEmail })
        .del()
      return true;
    } catch (error) {
      throw new Error('Could not delete subscriber');
    }
  }
}

module.exports = Subscriber;