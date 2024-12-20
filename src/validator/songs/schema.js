const joi = require('joi');

const songsPayLoadSchema = joi.object({
  title: joi.string().required(),
  year: joi.number().required().min(1900).max(2024),
  genre: joi.string().required(),
  performer: joi.string().required(),
  duration: joi.number(),
  albumId: joi.string(),
});
//opsional 2
const songsQuerySchema = joi.object({
  title: joi.string(),
  performer: joi.string(),
});

module.exports = { songsPayLoadSchema, songsQuerySchema };
