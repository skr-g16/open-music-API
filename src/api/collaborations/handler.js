const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsServices, playlistsServices, validator) {
    this._collaborationsServices = collaborationsServices;
    this._playlistsServices = playlistsServices;
    this._validator = validator;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialsId } = request.auth.credentials;
    await this._playlistsServices.verifyPlaylistOwner(
      playlistId,
      credentialsId
    );
    const collaborationId = await this._collaborationsServices.addCollaboration(
      playlistId,
      userId
    );
    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: { collaborationId },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialsId } = request.auth.credentials;
    await this._playlistsServices.verifyPlaylistOwner(
      playlistId,
      credentialsId
    );
    await this._collaborationsServices.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
