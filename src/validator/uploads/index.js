const { CoverUrlSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const UploadsValidator = {
  validateCoverUrl: (headers) => {
    const validationResult = CoverUrlSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
