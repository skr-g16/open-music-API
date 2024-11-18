const albumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const AlbumsHandler = new albumsHandler(service, validator);
    server.route(routes(AlbumsHandler));
  },
};
