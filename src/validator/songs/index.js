const { songsPayLoadSchema } = require('./schema');
const clientError = require('../../exceptions/clientError');

const songsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new clientError(validationResult.error.message);
    }
  },
};

module.exports = songsValidator;
