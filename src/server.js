const Hapi = require('@hapi/hapi');

const AlbumsService = require('./services/postgres/albumsServices');
const albums = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

const SongsServices = require('./services/postgres/songsServices');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const clientError = require('./exceptions/clientError');

const users = require('./api/users');
const UsersServices = require('./services/postgres/usersServices');
const UsersValidator = require('./validator/users');

const authentication = require('./api/authentications');
const AuthenticationsServices = require('./services/postgres/authenticationsServices');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/tokenManager');

require('dotenv').config();

const init = async () => {
  const albumsServices = new AlbumsService();
  const songsServices = new SongsServices();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsServices,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationsServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
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
