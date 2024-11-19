const { songsPayLoadSchema } = require('./schema');
const clientError = require('../../exceptions/clientError');

const songsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = songsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new clientError(validationResult.error.message);
    }
  },
};

module.exports = songsValidator;
