// @ts-check
const express = require('express');
const router = express.Router();

const SubscriberController = require('../controllers/Subscriber.controller');
const {
    validateSubscriberBody, validateEmailParam, validateIdParam
} = require('../middlewares/validateSubscriber');

// POST /subscribers
router.post('/subscribers',
    validateSubscriberBody, SubscriberController.addSubscriber);

// GET /subscribers
router.get('/subscribers/emails/:email', validateEmailParam, SubscriberController.getSubscriberByEmail);
router.get('/subscribers/:id', validateIdParam, SubscriberController.getSubscriberById);

// GET subscribers by page
router.get('/subscribers', SubscriberController.getAllSubscribers)

// DELETE /subscribers
router.delete('/subscribers/emails/:email', validateEmailParam, SubscriberController.deleteByEmail);
router.delete('/subscribers/:id', validateIdParam, SubscriberController.deleteById);

module.exports = router;
