const songsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const SongsHandler = new songsHandler(service, validator);
    server.route(routes(SongsHandler));
  },
};
