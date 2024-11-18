const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
const notFoundError = require('../../exceptions/notFoundError');

class songsServices {
  constructor() {
    this._songs = [];
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const song = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };
    this._songs.push(song);
    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSuccess) {
      throw new invariantError('Lagu gagal ditambahkan');
    }
    console.log(this._songs);
    return id;
  }

  async getSongs() {
    return this._songs.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));
  }

  async getSongById(id) {
    const song = this._songs.filter((song) => song.id === id)[0];
    if (!song) {
      throw new notFoundError('Lagu tidak ditemukan');
    }
    return song;
  }

  async editSongById(id, { title, year, genre, performer, duration }) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new notFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
    const updated = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
    };
    this._songs[index] = updated;
  }

  async deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new notFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = songsServices;
