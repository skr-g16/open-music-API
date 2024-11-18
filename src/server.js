const Hapi = require('@hapi/hapi');
const albumsService = require('./services/postgres/albumsServices');
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');
const clientError = require('./exceptions/clientError');

require('dotenv').config();

const init = async () => {
  const AlbumsServices = new albumsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });

  await server.register({
    plugin: albums,
    options: {
      service: AlbumsServices,
      validator: albumsValidator,
    },
  });

  //custom error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof clientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
