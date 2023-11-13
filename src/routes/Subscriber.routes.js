
const express = require('express');
const router = express.Router();
const SubscriberController = require('../controllers/Subscriber.controller');

// POST /subscribers
router.post('/', SubscriberController.addSubscriber);

module.exports = router;
