//@ts-check
const { db, TABLES } = require('../db');
const { Util } = require('../utils/index');


/* DEFINED DATA TYPES. Hover on the declaration to see the type */
/**
 * @typedef {object} IContact
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} description
 * @property {string?} website
 */

class Contact {
  /**@private @readonly */
  static selectFields = [
    'id', 'firstName', 'lastName',
    'description', 'website', 'email'
  ]
  /**@private @readonly */
  static pageLimit = 20;

  /**
   * @async
   * add a contact to the database
   * @param {IContact} contactData 
   */
  static async addContact(contactData) {
    try {
      const [id] = await db(TABLES.CONTACTS)
        .insert({ ...contactData })
      return {
        id: id,
        ...contactData
      }
    } catch (error) {
      throw new Error('Could not add contact')
    }
  }

  /**
   * @async
   * retrieves a contact resource
   * @param {string} contactEmail 
   * @returns {Promise<object>} a contact resource
   */
  static async getContactByEmail(contactEmail) {
    try {
      const contact = await db(TABLES.CONTACTS)
        .where({ email: contactEmail }).first();
      if (!contact) {
        return null;
      }
      return Object.assign({}, contact);
    } catch (error) {
      throw new Error('Could not get contact');
    }
  }

  /**
   * @async
   * retrieves a contact resource
   * @param {number} contactId 
   * @returns {Promise<object>} a contact resource
   */
  static async getContactById(contactId) {
    try {
      const contact = await db(TABLES.CONTACTS)
        .where({ id: contactId }).first();
      if (!contact) {
        return null;
      }
      return Object.assign({}, contact);
    } catch (error) {
      throw new Error('Could not get contact');
    }
  }

  /**
   * retrieves all contact by page
   * @param {number} pageNum 
   * @returns {Promise<object>} contains contacts data by page and
   * next page number 
   */
  static async getAllContacts(pageNum = 1) {
    // get offset for pagination
    const offset = Util.getOffset(pageNum, this.pageLimit);
    try {
      const allContacts = await db(TABLES.CONTACTS)
        .select(...this.selectFields)
        .limit(this.pageLimit)
        .offset(offset)
        .orderBy('id')

      if (!allContacts) {
        return { data: [], nextPageNum: null };
      }

      // set new offset and get next page number
      const newOffset = this.pageLimit + offset;
      const nextPageNum = await Util.
        getNextPage(newOffset, this.pageLimit, TABLES.CONTACTS);

      const data = allContacts.map(contact => {
        // cleanup object. knex returns RowData {}, set to pure object
        const contactObj = Object.assign({}, contact);
        return contactObj;
      });

      return { data, nextPageNum };

    } catch (error) {
      throw new Error(`Could not get subscribers for ${pageNum}`);
    }
  }


  /**
   * @async
   * deletes a contact by email.
   * @param {string} contactEmail 
   * @returns {Promise<boolean>}
   */
  static async deleteByEmail(contactEmail) {
    try {
      await db(TABLES.CONTACTS)
        .where({ email: contactEmail })
        .del()
      return true;
    } catch (error) {
      throw new Error('Could not delete contact');
    }
  }

  /**
   * @async
   * deletes a contact by id.
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async deleteById(id) {
    try {
      await db(TABLES.CONTACTS)
        .where({ id: id })
        .del()
      return true;
    } catch (error) {
      throw new Error('Could not delete contact');
    }
  }
}

module.exports = Contact;