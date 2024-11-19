const { songsPayLoadSchema, songsQuerySchema } = require('./schema');
const clientError = require('../../exceptions/clientError');

const songsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = songsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new clientError(validationResult.error.message);
    }
  },
  validateSongsQuery: (query) => {
    const validationResult = songsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new clientError(validationResult.error.message);
    }
  },
};

module.exports = songsValidator;
