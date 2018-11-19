'use strict';

const Joi = require('joi');
const common = require('./common');

const getProducts = Joi.object().keys({
  color: common.color
}).unknown(false);

module.exports = {
  getProducts
};