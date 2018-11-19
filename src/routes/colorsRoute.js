'use strict';

const koa_outer = require('koa-joi-router');

/**
 * @function colorsRouter
 *
 * factory function to create object of colors routes
 *
 * @param {object} services - object to get and send data
 *
 * @returns {object} the router object
 */
const colorsRouter = function colorsRouter({services}) {
  const colorsService = services.colorsService;
  const router = new koa_outer();

  /**
   * @function getColors
   *
   * handler for get colors request
   *
   * @param {object} ctx - the current request's context object
   *
   * @returns {object} the colors object
   */
  const getColors = async function getColors(ctx) {
    ctx.body = await colorsService.getColors(ctx);
  };

  router.route({
    method: 'GET',
    path: '/',
    handler: getColors
  });

  return router;
};

module.exports = colorsRouter;