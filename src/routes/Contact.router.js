// @ts-check
const express = require('express');
const router = express.Router();

const ContactController = require('../controllers/Contact.controller');
const {
    validateContactBody, validateContactParam
} = require('../middlewares/validateContact');

// POST /contacts
router.post('/contacts',
    validateContactBody, ContactController.addContact);

// GET /contacts
router.get('/contacts/:email',
    validateContactParam, ContactController.getContact)
// GET contacts by page
router.get('/contacts', ContactController.getAllContacts)

// DELETE /subscribers
router.delete('/contacts/:email',
    validateContactParam, ContactController.deleteContact)

module.exports = router;
