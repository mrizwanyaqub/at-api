'use strict';

/**
 * @function colorsService
 *
 * factory function to create object of colors service
 *
 * @param {object} data - object to get and send data
 *
 * @returns {object} the object containing functions to process colors data
 */
const colorsService = function colorsService({data}) {

  /**
   * @function getColors
   *
   * the functions gets data from external system
   *
   * @param {object} ctx - the context object for the current request
   *
   * @returns {object} the colors object
   */
  const getColors = async function getColors(ctx) {
    if(!ctx || !ctx.partner || !ctx.partner.apis || !ctx.partner.apis.colors) {
      throw new Error('No ctx or invalid ctx object provided');
    }

    const colors = await data.get(ctx, ctx.partner.apis.colors, 'get');
    const colorsArray = [];
    for(let key in colors) {
      if(colors.hasOwnProperty(key))
        colorsArray.push({
          color: key,
          code: colors[key]
        });
    }
    return colorsArray;
  };

  return {
    getColors
  }
};

module.exports = colorsService;