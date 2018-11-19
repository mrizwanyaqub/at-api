'use strict';

const koa_outer = require('koa-joi-router');
const { schemaRules, authorize } = require('../helpers');

/**
 * @function productsRouter
 *
 * factory function to create object of products routes
 *
 * @param {object} services - object to get and send data
 *
 * @returns {object} the router object
 */
const productsRouter = function productsRouter({services}) {
  const productsService = services.productsService;
  const router = new koa_outer();

  /**
   * @function getProducts
   *
   * handler for get products request
   *
   * @param {object} ctx - the current request's context object
   *
   * @returns {array} the products array
   */
  const getProducts = async function getProducts(ctx) {
    let products = await productsService.getProducts(ctx, ctx.request.params.color);
    ctx.body = products.length > 15 ? products.splice(0, 15) : products;
  };

  router.route({
    method: 'GET',
    path: '/:color',
    validate: {
      params: schemaRules.products.getProducts
    },
    handler: authorize(getProducts, {}) // this way we can authorize route for the request for route specific auth rules
  });

  return router;
};

module.exports = productsRouter;