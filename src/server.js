const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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

const playlists = require('./api/playlists');
const PlaylistsServices = require('./services/postgres/playlistsServices');
const PlaylistSongsServices = require('./services/postgres/playlistSongsServices');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistSongActivitiesServices = require('./services/postgres/playlistSongActivitiesServices');

const collaborations = require('./api/collaborations');
const CollaborationsServices = require('./services/postgres/collaborationsServices');
const CollaborationsValidator = require('./validator/collaborations');

const _exports = require('./api/exports');
const producerServices = require('./services/rabbitmq/producerServices');
const ExportsValidator = require('./validator/exports');

require('dotenv').config();

const init = async () => {
  const albumsServices = new AlbumsService();
  const songsServices = new SongsServices();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const collaborationsServices = new CollaborationsServices();
  const playlistsServices = new PlaylistsServices(collaborationsServices);
  const playlistSongsServices = new PlaylistSongsServices();
  const playlistSongActivitesServices = new PlaylistSongActivitiesServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });
  //register jwt
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
  //define auth strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlists,
      options: {
        playlistsServices,
        playlistSongsServices,
        playlistSongActivitesServices,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsServices,
        playlistsServices,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: producerServices,
        playlistsServices,
        validator: ExportsValidator,
      },
    },
  ]);

  //custom error
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

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error
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
  console.log('Server running on', server.info.uri);
};

init();
