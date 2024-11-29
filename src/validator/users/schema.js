const joi = require('joi');

const usersPayLoadSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  fullname: joi.string().required(),
});

module.exports = { usersPayLoadSchema };
