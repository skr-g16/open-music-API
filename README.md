# API Endpoints

## **Albums**

- **POST /albums**: Add a new album.
- **GET /albums/{albumId}**: Get the details of an album and its list of songs.
- **PUT /albums/{albumId}**: Update album data.
- **DELETE /albums/{albumId}**: Delete an album.

## **Songs**

- **POST /songs**: Add a new song.
- **GET /songs**: Get a list of songs (with optional search based on query parameters `title` and/or `performer`).
- **GET /songs/{songId}**: Get the details of a song.
- **PUT /songs/{songId}**: Update song data.
- **DELETE /songs/{songId}**: Delete a song.
