const Hapi = require('@hapi/hapi');
const albumsService = require('./services/inMemory/albumServices');
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');
const clientError = require('./exceptions/clientError');

const init = async () => {
  const AlbumsServices = new albumsService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: { cors: { origin: ['*'] } },
  });

  await server.register({
    plugin: albums,
    options: {
      service: AlbumsServices,
      validator: albumsValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof clientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }
      //server ERROR!
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
