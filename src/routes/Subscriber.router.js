// @ts-check
const express = require('express');
const router = express.Router();

const SubscriberController = require('../controllers/Subscriber.controller');
const {
    validateSubscriberBody, validateSubscriberParam
} = require('../middlewares/validateSubscriber');

// POST /subscribers
router.post('/subscribers',
    validateSubscriberBody, SubscriberController.addSubscriber);

// GET /subscribers
router.get('/subscribers/:email',
    validateSubscriberParam, SubscriberController.getSubscriber)
// GET subscribers by page
router.get('/subscribers', SubscriberController.getAllSubscribers)

// DELETE /subscribers
router.delete('/subscribers/:email',
    validateSubscriberParam, SubscriberController.deleteSubscriber)

module.exports = router;
