const redis = require('redis');
const config = require('../../utils/config');

class CacheServices {
  constructor() {
    this._client = redis.createClient({
      host: config.redis.host,
    });
    this._client.on('error', (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  async set(key, value, expirationSecond = 1800) {
    await this._client.set(key, value, { EX: expirationSecond });
  }

  async get(key) {
    const value = await this._client.get(key);
    if (!value) {
      throw new Error('Cache tidak ditemukan');
    }
    return value;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheServices;
