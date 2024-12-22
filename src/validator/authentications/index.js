const {
  authenticationsPayloadSchema,
  refreshTokenPayloadSchema,
  logoutPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const AuthenticationsValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = authenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateRefreshTokenPayload: (payload) => {
    const validationResult = refreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateLogoutPayload: (payload) => {
    const validationResult = logoutPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
