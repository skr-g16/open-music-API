const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/invariantError');
const NotFoundError = require('../../exceptions/notFoundError');
const AuthorizationError = require('../../exceptions/authorizationError');
const { mapDBtoModel2 } = require('../../utils/mapDBToModel');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const albumsQuery = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [id],
    };
    const albumResult = await this._pool.query(albumsQuery);
    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const album = albumResult.rows.map(mapDBtoModel2)[0];
    const songsQuery = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };
    const songsResult = await this._pool.query(songsQuery);

    return {
      ...album,
      songs: songsResult.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
    return result.rows[0].id;
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
  async updateCovers(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(
        'Gagal memperbarui cover album. Id tidak ditemukan'
      );
    }
  }

  async verifyAlbumOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
    const album = result.rows[0];
    if (album.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addLikeAlbums(id, userId) {
    const albumsQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };
    const albumsResult = await this._pool.query(albumsQuery);
    if (!albumsResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const likeAlbumsCheck = {
      text: 'SELECT * FROM user_albums_like WHERE user_id = $1 AND album_id = $2',
      values: [userId, id],
    };
    const checkResult = await this._pool.query(likeAlbumsCheck);
    if (checkResult.rowCount > 0) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }
    const idLike = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_albums_like VALUES($1, $2, $3) RETURNING id',
      values: [idLike, userId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getLikesAlbums(id) {
    const query = {
      text: 'SELECT * FROM user_albums_like WHERE album_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async deleteLikeAlbums(id, userId) {
    const query = {
      text: 'DELETE FROM user_albums_like WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [id, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Like gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = AlbumsService;
