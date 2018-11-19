'use strict';

const _router = require('koa-router');

function routes({services}) {
  const router = new _router();

  router.use('/colors', require('./colorsRoute')({services}).middleware());
  router.use('/products', require('./productsRoute')({services}).middleware());

  return router;
}

module.exports = routes;