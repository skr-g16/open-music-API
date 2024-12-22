const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistsServices,
      playlistSongsServices,
      playlistSongActivitesServices,
      validator,
    }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsServices,
      playlistSongsServices,
      playlistSongActivitesServices,
      validator
    );
    server.route(routes(playlistsHandler));
  },
};
