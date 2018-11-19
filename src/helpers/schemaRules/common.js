'use strict';

const Joi = require('joi');

module.exports = {
  color: Joi.string().min(3).max(20).regex(/^[A-Z ]+$/i),
};