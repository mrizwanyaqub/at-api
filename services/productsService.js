'use strict';

const { products } = require('../models');

/**
 * @function productsService
 *
 * factory function to create object of products service
 *
 * @param {object} data - object to get and send data
 *
 * @returns {object} the object containing functions to process products data
 */
function productsService({data}) {

  /**
   * @function getProducts
   *
   * the functions gets products from external system, transforms partner system data to our own format
   *
   * @param {object} ctx - the context object for the current request
   *
   * @param {string} color - the color of the products to be fetched
   *
   * @returns {array} the products array
   */
  async function getProducts(ctx, color) {
    if(!ctx || !ctx.partner || !ctx.partner.apis || !ctx.partner.apis.products) {
      throw new Error('No ctx or invalid ctx object provided');
    }

    if(!color) {
      throw new Error('No color provided');
    }

    const url = ctx.partner.apis.products + '?searchString=&filters[availableColors][]=' + formatColor(color);
    return await data.get(ctx, url, 'post', function modler(data) {
      //we can filter data here if we need to do, like for out off stock items etc
      return products(data.hits);
    });
  }

  return {
    getProducts
  }
}

/**
 * @function formatColor
 *
 * capitalizes the first letter of color name
 *
 * @param {string} color - the color name
 *
 * @returns {string} formatted color name
 */
function formatColor(color)
{
  return color.charAt(0).toUpperCase() + color.toLowerCase().slice(1);
}

module.exports = productsService;