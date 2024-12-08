const ClientError = require('./clientError');

class AuthenticationError extends ClientError {
  constructor(message, statusCode = 401) {
    super(message, statusCode);
    this.name = 'authenticationError';
  }
}

module.exports = AuthenticationError;
