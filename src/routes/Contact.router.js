// @ts-check
const express = require('express');
const router = express.Router();

const ContactController = require('../controllers/Contact.controller');
const {
    validateContactBody, validateEmailParam, validateIdParam
} = require('../middlewares/validateContact');

// POST /contacts
router.post('/contacts',
    validateContactBody, ContactController.addContact);

// GET /contacts
router.get('/contacts/emails/:email', validateEmailParam, ContactController.getContactByEmail);
router.get('/contacts/:id', validateIdParam, ContactController.getContactById);

// GET contacts by page
router.get('/contacts', ContactController.getAllContacts)

// DELETE /subscribers
router.delete('/contacts/emails/:email', validateEmailParam, ContactController.deleteByEmail);
router.delete('/contacts/:id', validateIdParam, ContactController.deleteById)

module.exports = router;
