const { playlistsPayloadSchema, addSongToPlaylistSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = playlistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAddSongToPlaylistPayload: (payload) => {
    const validationResult = addSongToPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
