const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsServices, validator) {
    this._producerService = producerService;
    this._playlistsServices = playlistsServices;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialsId } = request.auth.credentials;
    await this._playlistsServices.verifyPlaylistOwner(
      playlistId,
      credentialsId
    );
    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    );
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}
module.exports = ExportsHandler;
