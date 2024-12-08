const { songsPayLoadSchema, songsQuerySchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = songsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongsQuery: (query) => {
    const validationResult = songsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
