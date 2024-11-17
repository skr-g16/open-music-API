const Hapi = require('@hapi/hapi');
const albumsService = require('./services/inMemory/albumServices');
const albums = require('./api/albums');

const init = async () => {
  const AlbumsServices = new albumsService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: { cors: { origin: ['*'] } },
  });

  await server.register({
    plugin: albums,
    options: { service: AlbumsServices },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
