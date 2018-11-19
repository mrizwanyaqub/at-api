'use strict';

/**
 * @function authorize
 *
 * partial function to authorize incoming requests to api
 *
 * @param {function} handler - a function to handle incoming request if its authorized
 *
 * @param {object} authRules - an object containing authorization rules for the incoming request
 *
 * @returns {function} to be used when request lands on router to authorize the request
 */
module.exports = function authorize(handler, authRules) {
  if(!handler)
    new Error('handler not defined');

  //if no route specific auth routes are defined then use default auth rules.
  if(!authRules)
    authRules = {};

  /**
   * @function _authorize
   *
   * authorizes the incoming request
   *
   * @param {object} ctx a context object for the current request
   *
   * @returns {promise} executes the handler for the request if request is authorized else throws error for unauthorized requests
   */
  return async function _authorize(ctx) {
    let authorized = !!authRules; //set authorize after validating request on authRules.
    if(authorized)
      return await handler(ctx);

    ctx.throw(401, 'unauthorized to access the route');
  };
};