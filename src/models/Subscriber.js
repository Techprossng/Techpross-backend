const { Model } = require('objection');

class Subscriber extends Model {
  static get subscribers() {
    return 'subscribers';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', maxLength: 128, unique: true },
      },
    };
  }
}

module.exports = Subscriber;
