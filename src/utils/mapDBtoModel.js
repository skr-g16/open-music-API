/* eslint-disable camelcase */
const mapDBtoModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapDBtoModel2 = ({ id, name, year, cover_url }) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
});

module.exports = { mapDBtoModel, mapDBtoModel2 };
