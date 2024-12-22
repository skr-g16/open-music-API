const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/notFoundError');
const InvariantError = require('../../exceptions/invariantError');
class PlaylistSongsServices {
  constructor() {
    this._pool = new Pool();
  }
  async addSongToPlaylist(playlistId, songId) {
    const songQuery = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const songResult = await this._pool.query(songQuery);
    if (!songResult.rowCount) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
    const playlistSongsId = `playlist-songs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [playlistSongsId, playlistId, songId],
    };
    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
            FROM playlist_songs
            LEFT JOIN playlists ON playlists.id = playlist_songs.playlist_id
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);
    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM playlist_songs
            LEFT JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const songResult = await this._pool.query(songQuery);
    return {
      ...playlistResult.rows[0],
      songs: songResult.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const playlistQuery = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const query = {
      text: `DELETE FROM playlist_songs
      WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(
        'Lagu pada playlist gagal dihapus, lagu dan/atau playlist tidak ditemukan'
      );
    }
  }
}
module.exports = PlaylistSongsServices;
