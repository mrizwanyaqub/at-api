'use strict';


/**
 * @function mapFromJson
 *
 * transforms the data coming from external system to use it in internal system
 *
 * @param {object || array} json - the source data to be transformed
 *
 * @returns {object || array} the transformed data
 */
function mapFromJson(json) {
  if(!json)
    return null;

  if(Array.isArray(json))
    return json.map(objectFromJson);

  return objectFromJson(json);
}

function objectFromJson(json) {
  if(!json)
    return null;

  const {productId, name, description, price, minPrice, color, availableColors, media, image, smallImage, thumbnail, isInStock, stockOfAllOptions} = json;
  return {productId, name, description, price, minPrice, color, availableColors, media, image, smallImage, thumbnail, isInStock, stockOfAllOptions};
}

module.exports = mapFromJson;