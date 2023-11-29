//@ts-check

const Contact = require('../models/Contact');
const { Util } = require('../utils');

// DEFINED TYPES. Hover on types defined with `typedef` to view.
/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

class ContactController {
  /**
   * add a contact
   * @type {Handler}
   */
  static async addContact(request, response) {
    const {
      email, firstName, lastName,
      website, description, course
    } = request.body;

    try {
      // save contact
      const contactData = {
        email, firstName, lastName,
        website, description, course
      }
      const savedContact = await Contact.addContact(contactData);
      const toReturn = { message: 'success', ...savedContact };

      return response.status(201).json(toReturn);

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * retrieves a contact resource
   * @type {Handler}
   */
  static async getContactByEmail(request, response) {
    const { email } = request.params;

    try {
      const contact = await Contact.getContactByEmail(email);
      if (!contact) {
        return response.status(404).json({ error: 'Not found' });
      }

      return response.status(200).json({ mesage: 'success', ...contact });

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * retrieves a contact resource
   * @type {Handler}
   */
  static async getContactById(request, response) {
    const { id } = request.params;

    try {
      const contactId = parseInt(id, 10);

      const contact = await Contact.getContactById(contactId);
      if (!contact) {
        return response.status(404).json({ error: 'Not found' });
      }

      return response.status(200).json({ mesage: 'success', ...contact });

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * retrieves subscribers by page
   * @type {Handler}
   */
  static async getAllContacts(request, response) {
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
      const { contacts, nextPageNum } = await Contact.getAllContacts(pageNum);

      const toReturn = { contacts, current: pageNum, next: nextPageNum }

      return response.status(200).json({ message: 'success', ...toReturn });

    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * removes a contact from the database
   * @type {Handler}
   */
  static async deleteByEmail(request, response) {
    const { email } = request.params;

    try {
      // delete resource
      const isDeleted = await Contact.deleteByEmail(email)
      if (!isDeleted) {
        throw new Error('Could not delete');
      }

      return response.status(204).json({});

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * removes a contact from the database
   * @type {Handler}
   */
  static async deleteById(request, response) {
    const { id } = request.params;

    try {
      // delete resource
      const contactId = parseInt(id, 10);

      const isDeleted = await Contact.deleteById(contactId)
      if (!isDeleted) {
        throw new Error('Could not delete');
      }

      return response.status(204).json({});

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

}

module.exports = ContactController;
