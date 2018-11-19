'use strict';

module.exports = function clients({configs}) {
  return {
    redis: require('./redis')(Object.assign({}, {
      ttl: configs.cache.ttl
    }, configs.cache['redis']))
  }
};