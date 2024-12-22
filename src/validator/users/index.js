const { usersPayLoadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = usersPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
