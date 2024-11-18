const { albumsPayLoadSchema } = require('./schema');
const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumsPayLoadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = albumsValidator;
