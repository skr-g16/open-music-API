const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    { playlistsServices, playlistSongsServices, validator }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsServices,
      playlistSongsServices,
      validator
    );
    server.route(routes(playlistsHandler));
  },
};
