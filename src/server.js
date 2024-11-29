const Hapi = require('@hapi/hapi');
const albumsService = require('./services/postgres/albumsServices');
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');
const songsServices = require('./services/postgres/songsServices');
const songs = require('./api/songs');
const songsValidator = require('./validator/songs');
const clientError = require('./exceptions/clientError');

const users = require('./api/users');
const UsersServices = require('./services/postgres/usersServices');
const usersValidator = require('./validator/users');

require('dotenv').config();

const init = async () => {
  const AlbumsServices = new albumsService();
  const SongsServices = new songsServices();
  const usersServices = new UsersServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: AlbumsServices,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: SongsServices,
        validator: songsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: usersValidator,
      },
    },
  ]);

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
