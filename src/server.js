require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Disini kamu bisa membuat extentions function untuk lifecycle server onPreResponse,
  // Dimana ia akan mengintervensi response sebelum dikirimkan ke client.
  // Disana kamu bisa menetapkan error handling bila response tersebut merupakan client error.
  server.ext('onPreResponse', (request, h) => {
    // Mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof ClientError) {
      // Membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server is running at ${server.info.uri}`);
};

init();
