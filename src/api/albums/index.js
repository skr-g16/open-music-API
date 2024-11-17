const albumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service }) => {
    const AlbumsHandler = new albumsHandler(service);
    server.route(routes(AlbumsHandler));
  },
};
