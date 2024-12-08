const { albumsPayLoadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');
const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
