const exportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (
    server,
    { producerService, playlistsServices, validator }
  ) => {
    const ExportsHandler = new exportsHandler(
      producerService,
      playlistsServices,
      validator
    );
    server.route(routes(ExportsHandler));
  },
};
