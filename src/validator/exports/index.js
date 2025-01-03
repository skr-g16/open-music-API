const { exportPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const { error } = exportPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};
module.exports = ExportsValidator;
