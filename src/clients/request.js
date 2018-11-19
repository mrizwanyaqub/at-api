'use strict';

const requestDispatcher = require('request-promise');

/**
 * @function restClient
 *
 * Creates an object containing the functions to call external systems using http methods
 *
 * @returns {object} An object containing the functions to call external apis
 */
function restClient() {
  const baseReq = {
    simple: false,
    resolveWithFullResponse: true,
    json: true
  };

  /**
   * @function pathJoin
   *
   * joins path if source path was array
   *
   * @param {array || string} path a string or array of paths to be joined
   *
   * @returns {string} A joined path
   */
  const pathJoin = function (path) {
    return Array.isArray(path) ? path.join('/') : path;
  };


  /**
   * @function pathJoin
   *
   * calls the external api with given req options
   *
   * @param {object} exeReq an object containing request specific information
   *
   * @returns {object} returns response of the request
   */
  const execute = async function (exeReq) {
    const req = Object.assign({}, baseReq, exeReq);
    const result = await requestDispatcher(req);
    return (({statusCode, body, headers, cookies, request}) => ({statusCode, body, headers, cookies, request}))(result);
  };


  /**
   * @function requestWithQuery
   *
   * factory function to be used for get and delete methods
   *
   * @param {string} method a string name of html method to be used
   *
   * @returns {function} to make calls for specified http method
   */
  const requestWithQuery = function (method) {
    return async function (path, qs) {
      if(!qs)
        qs = null;

      const req = {
        method: method.toUpperCase(),
        url: pathJoin(path),
        qs
      };
      return await execute(req);
    };
  };


  /**
   * @function requestWithBody
   *
   * factory function to be used for post, patch and put methods
   *
   * @param {string} method - a string name of html method to be used
   *
   * @returns {function} to make calls for specified http method
   */
  const requestWithBody = function (method) {
    return async function (path, body) {
      body = body || {};
      const req = {
        method: method.toUpperCase(),
        url: pathJoin(path),
        body
      };
      return await execute(req);
    };
  };

  return {
    get: requestWithQuery('get'),
    post: requestWithBody('post')
  };
}

module.exports = restClient;