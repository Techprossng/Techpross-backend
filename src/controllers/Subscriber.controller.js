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
   * retrieves a subscriber by email
   * @type {Handler}
   */
  static async getSubscriberByEmail(request, response) {
    const { email } = request.params;
    if (!email || !Util.checkIsEmail(email)) {
      return response.status(400).json({ error: 'Invalid email' });
    }

    try {
      const subscriber = await Subscriber.getSubscriberByEmail(email);
      if (!subscriber) {
        return response.status(404).json({ error: 'Not found' });
      }
      const { id } = subscriber;

      return response.status(200).json({ mesage: 'success', id, email })
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * retrieves a subscriber by id
   * @type {Handler}
   */
  static async getSubscriberById(request, response) {
    const { id } = request.params;

    const subscriberId = parseInt(id, 10);

    try {
      const subscriber = await Subscriber.getSubscriberById(subscriberId);
      if (!subscriber) {
        return response.status(404).json({ error: 'Not found' });
      }
      const { email } = subscriber;

      return response.status(200).json({ mesage: 'success', id: subscriberId, email })
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * removes a subscriber from the database by email
   * @type {Handler}
   */
  static async deleteByEmail(request, response) {
    /** @type {string} */
    const { email } = request.params;

    try {
      // Enforce idempotency in requests
      const subscriberExists = await Subscriber.getSubscriberByEmail(email);

      if (!subscriberExists) {
        response.status(404).json({});
      }

      // delete resource
      const isDeleted = await Subscriber.deleteByEmail(email)
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
   * removes a subscriber from the database by email
   * @type {Handler}
   */
  static async deleteById(request, response) {
    /** @type {string} */
    const { id } = request.params;

    try {
      const subscriberId = parseInt(id, 10);
      // Enforce idempotency in requests
      const subscriberExists = await Subscriber.getSubscriberById(subscriberId);

      if (!subscriberExists) {
        response.status(404).json({});
      }

      // delete resource
      const isDeleted = await Subscriber.deleteById(subscriberId)
      if (!isDeleted) {
        throw new Error('Could not delete');
      }
      const toReturn = {
        message: 'success',
        id
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
      const { subscribers, nextPageNum } = await Subscriber.getAllSubscribers(pageNum);

      const toReturn = { subscribers, current: pageNum, next: nextPageNum }

      return response.status(200).json({ message: 'success', ...toReturn });

    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


module.exports = SubscriberController;
