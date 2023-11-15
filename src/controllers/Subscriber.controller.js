const Subscriber = require('../models/Subscriber');


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
        message: 'Subscriber added successfully',
        ...newSubscriber
      }
      return response.status(201).json(toReturn);
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
    const email = request.body.email;

    try {
      // Enforce idempotency in requests
      const subscriberExists = await Subscriber.getSubscriberByEmail(email);

      if (!subscriberExists) {
        response.status(404).json({});
      }

      // delete resource
      const isDeleted = await Subscriber.deleteSubscriber(email)

      const toReturn = {
        message: 'Subscriber removed successfully'
      }
      return response.status(200).json(toReturn);

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}


module.exports = SubscriberController;
