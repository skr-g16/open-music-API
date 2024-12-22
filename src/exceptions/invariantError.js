const ClientError = require('./clientError');
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'invariantError';
  }
}
module.exports = InvariantError;
