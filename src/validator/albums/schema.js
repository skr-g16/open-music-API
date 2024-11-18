const joi = require('joi');

const albumsPayLoadSchema = joi.object({
  name: joi.string().required(),
  year: joi.number().required().min(1900).max(2024),
});

module.exports = { albumsPayLoadSchema };
