'use strict';

function services({data}) {
  return {
    colorsService: require('./colorsService')({data}),
    productsService: require('./productsService')({data})
  }
}

module.exports = services;