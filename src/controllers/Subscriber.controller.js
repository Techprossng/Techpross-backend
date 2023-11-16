const Subscriber = require('../models/Subscriber');
const { Util } = require('../utils');


// DEFINED TYPE
/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {import('express').Response}
 */

class SubscriberController {

  /**
   * adds a subscriber to the database 
   * @type {Handler}
   */
  static async addSubscriber(request, response) {
    const { email } = request.body;

    try {
      // Create a new subscriber
      const newSubscriber = await Subscriber.addSubscriber(email);
      const toReturn = {
        message: 'success',
        ...newSubscriber
      }
      return response.status(201).json(toReturn);
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * retrieves a subscriber
   * @type {Handler}
   */
  static async getSubscriber(request, response) {
    const { email } = request.params;
    if (!email || !Util.checkIsEmail(email)) {
      return response.status(400).json({ error: 'Invalid email' });
    }

    try {
      const subscriber = await Subscriber.getSubscriberByEmail(email);
      if (!subscriber) {
        return response.status(400).json({ error: 'Not found' });
      }
      const { id } = subscriber;

      return response.status(200).json({ mesage: 'success', id, email })
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * removes a subscriber from the database
   * @type {Handler}
   */
  static async deleteSubscriber(request, response) {
    /** @type {string} */
    const { email } = request.params;

    try {
      // Enforce idempotency in requests
      const subscriberExists = await Subscriber.getSubscriberByEmail(email);

      if (!subscriberExists) {
        response.status(404).json({});
      }

      // delete resource
      const isDeleted = await Subscriber.deleteSubscriber(email)
      if (!isDeleted) {
        throw new Error('Could not delete');
      }
      const toReturn = {
        message: 'success',
        email
      }
      return response.status(200).json(toReturn);

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * retrieves subscribers by page
   * @type {Handler}
   */
  static async getAllSubscribers(request, response) {
    let pageNum;

    // get page number
    const { page } = request.query;

    // parse page number
    if (!page || !Util.checkDigit(page)) {
      pageNum = 1;
    } else {
      // page number must be greater than 0
      pageNum = parseInt(page, 10) <= 0 ? 1 : parseInt(page, 10);
    }

    try {
      // get subscribers by page
      const { data, nextPageNum } = await Subscriber.getAllSubscribers(pageNum);

      const toReturn = { data, current: pageNum, next: nextPageNum }

      return response.status(200).json({ message: 'success', ...toReturn });

    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


module.exports = SubscriberController;
