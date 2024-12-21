const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsServices, playlistSongsServices, validator) {
    this._playlistsServices = playlistsServices;
    this._playlistSongsServices = playlistSongsServices;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsServices.addPlaylist({
      name,
      owner: credentialId,
    });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsServices.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsServices.verifyPlaylistOwner(id, credentialId);
    await this._playlistsServices.deletePlaylistById(id);
    return { status: 'success', message: 'Playlist berhasil dihapus' };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validateAddSongToPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlistsServices.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistSongsServices.addSongToPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsServices.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._playlistSongsServices.getSongsFromPlaylist(
      playlistId
    );
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlistsServices.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistSongsServices.deleteSongFromPlaylist(
      playlistId,
      songId
    );
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
