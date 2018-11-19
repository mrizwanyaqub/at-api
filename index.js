'use strict';

//set configs globally to access them in the code where needed
const configs = require('./getConfigs');
//global.configs = require('./configs');

const deppie = require('deppie');

const clients = require('./clients');
const request = clients.request;
const data = clients.data;

const cacheClients = require('./cacheClients');
const services = require('./services');
const routes = require('./routes');
const server = require('./server');

const modules = {
  configs,
  request,
  cacheClients,
  data,
  services,
  routes,
  server
};

deppie(modules);
