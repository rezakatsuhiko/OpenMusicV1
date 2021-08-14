const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.uploadSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllSongHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getIdSongHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.editIdSongHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteIdSongHandler,
  },
];

module.exports = routes;
