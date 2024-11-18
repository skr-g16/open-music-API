const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
const notFoundError = require('../../exceptions/notFoundError');
class AlbumsService {
  constructor() {
    this._albums = [];
  }
  addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const newNote = { id, name, year };
    this._albums.push(newNote);
    const isSuccess =
      this._albums.filter((album) => album.id === id).length > 0;
    if (!isSuccess) {
      throw new invariantError('Album gagal ditambahkan');
    }
    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.filter((album) => album.id === id)[0];
    if (!album) {
      throw new notFoundError('Album tidak ditemukan');
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new notFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
    const updated = { ...this._albums[index], name, year };
    this._albums[index] = updated;
    return id;
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new notFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
