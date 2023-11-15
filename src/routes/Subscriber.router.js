// @ts-check
const express = require('express');
const router = express.Router();

const SubscriberController = require('../controllers/Subscriber.controller');
const validateSubscriber = require('../middlewares/validateSubscriber');

// POST /subscribers
router.post('/subscribers', validateSubscriber, SubscriberController.addSubscriber);
// DELETE /subscribers
router.delete('/subscribers', validateSubscriber, SubscriberController.deleteSubscriber)

module.exports = router;
