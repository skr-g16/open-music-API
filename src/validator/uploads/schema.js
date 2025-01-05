const Joi = require('joi');

const CoverUrlSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/svg+xml',
      'image/webp'
    )
    .required(),
}).unknown();

module.exports = { CoverUrlSchema };
