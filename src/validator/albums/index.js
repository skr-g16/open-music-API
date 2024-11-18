const { albumsPayLoadSchema } = require('./schema');
const clientError = require('../../exceptions/clientError');
const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new clientError(validationResult.error.message);
    }
  },
};

module.exports = albumsValidator;
