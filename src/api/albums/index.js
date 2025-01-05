const albumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (
    server,
    { service, validator, uploadValidator, localStorageService }
  ) => {
    const AlbumsHandler = new albumsHandler(
      service,
      validator,
      uploadValidator,
      localStorageService
    );
    server.route(routes(AlbumsHandler));
  },
};
