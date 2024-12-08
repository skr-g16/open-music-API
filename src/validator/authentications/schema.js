const Joi = require('joi');

const authenticationsPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const logoutPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  authenticationsPayloadSchema,
  refreshTokenPayloadSchema,
  logoutPayloadSchema,
};
