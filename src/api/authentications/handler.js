const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(usersServices, authenticationsServices, tokenManager, validator) {
    this._userServices = usersServices;
    this._authenticationsServices = authenticationsServices;
    this._tokenManager = tokenManager;
    this._validator = validator;
    autoBind(this);
  }

  async postAuthHandler(request, h) {
    this._validator.validateLoginPayload(request.payload);
    const { username, password } = request.payload;
    const id = await this._userServices.verifyUserCredential(
      username,
      password
    );
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    await this._authenticationsServices.addRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      message: 'Anda berhasil login',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthHandler(request, h) {
    this._validator.validateRefreshTokenPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationsServices.checkRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const response = h.response({
      status: 'success',
      message: 'Anda berhasil refresh token',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthHandler(request, h) {
    this._validator.validateRefreshTokenPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationsServices.checkRefreshToken(refreshToken);
    await this._authenticationsServices.deleteRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      message: 'Anda berhasil logout',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationsHandler;
