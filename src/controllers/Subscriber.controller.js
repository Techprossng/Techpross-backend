
const Subscriber = require('../models/Subscriber');

class SubscriberController {
  static async addSubscriber(request, response) {
    try {
      const { email } = request.body;

      // Validate email format
      if (!validateEmail(email)) {
        return response.status(400).json({ error: 'Invalid email format' });
      }

      // Check if email already exists
      const existingSubscriber = await Subscriber.query().findOne({ email });
      if (existingSubscriber) {
        return response.status(400).json({ error: 'Email already subscribed' });
      }

      // Create a new subscriber
      const newSubscriber = await Subscriber.query().insert({ email });

      return response.status(201).json({ message: 'Subscriber added successfully', ...newSubscriber });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}


function validateEmail(email) {
    // Email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    
}

module.exports = SubscriberController;
