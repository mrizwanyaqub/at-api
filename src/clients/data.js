'use strict';

/**
 * @function data
 *
 * Creates an object containing the setter and getter for redis client.
 *
 * @param {object} request - the object to communicate to external systems
 *
 * @param {object} cacheClients - the object containing supported cache clients in the system
 *
 * @param {object} configs - the object containing the global config object
 *
 * @returns {object} An object containing the functions to send and receive data from external systems
 */
function data({request, cacheClients, configs}) {
  const cacheConfigs = configs.cache;
  //get the desired cache store
  const cache = cacheClients[configs.cache.store];

  /**
   * @function get
   *
   * First tries to get data from cache, if not found then calls the external system
   *
   * @param {object} ctx - the context object of the current request
   *
   * @param {string} url - the url of external system to get data
   *
   * @param {string} method - the http method to be used to retrieve data
   *
   * @param {function} modeler - the function to transform 3rd party data to required data format
   *
   * @returns {object || array} An object or array containing the request data
   */
  const get = async function (ctx, url, method, modeler) {
    if(!ctx || !ctx.partner || !ctx.partner.apiBaseUrl) {
      throw new Error('No ctx or invalid ctx object provided');
    }
    if(!url || typeof url !== 'string') {
      throw new Error('url not provided or its invalid.');
    }
    if(!method || typeof method !== 'string' || ['get', 'post'].indexOf(method) === -1) {
      throw new Error('method not provided or its invalid.');
    }

    url = ctx.partner.apiBaseUrl + url; //prepare full url
    const key = url; //or hash the key and then set it

    //get data from cache if enabled
    let existingData = cacheConfigs.enabled ? await cache.getData(key) : null;
    if(existingData)
      return existingData;

    //get data from partner
    let resp = await request[method.toLowerCase()](url);
    let data = resp.statusCode === 200 ? resp.body : null;
    if (data) {
        data = JSON.parse(JSON.stringify(data));
        //transform data to desired format
        if(modeler)
          data = modeler(data);

        //store data in cache if enabled
        if(cacheConfigs.enabled)
          await cache.setData(key, data);
    }

    return data;
  };

  return {
    get
  };
}

module.exports = data;