'use strict';

const Koa = require('koa');
const cors = require('@koa/cors');
const statuses = require('statuses');
const uuid = require('uuid');
const koaLogger = require('koa-logger');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "altayer:api"});

const setCorsHeaders = function (ctx) {
  ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,PATCH,OPTIONS,DELETE');
  ctx.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Partner-Name, X-Request-Id');
  ctx.set('Access-Control-Expose-Headers', 'X-Request-Id');
  ctx.set('Access-Control-Max-Age', 3600);
  ctx.set('Access-Control-Allow-Credentials', true);
  const ALLOWED_ORIGINS = ctx.configs.allowedCorsOrigins;
  if (ctx.configs.env !== 'prod' || ALLOWED_ORIGINS.indexOf(ctx.get('Origin')) !== -1) {
    ctx.set('Access-Control-Allow-Origin', ctx.get('Origin'));
  }
};

const corsValidator = async function (ctx, next) {
  setCorsHeaders(ctx);
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  if (ctx.configs.env === 'prod') {
    await cors()(ctx, next);
    return;
  }

  await next();
  };

const partnerAuthentication = async function (ctx, next) {
  const PARTNERS = ctx.configs.partners;
  //we can use a middleware to authenticate the request in any way which is agreed with client.
  //but for now I'll only use a header to check the partner
  const partnerName = ctx.get('X-Partner-Name');
  if(!partnerName || !PARTNERS[partnerName]) {
    ctx.status = 401;
    ctx.body = 'unauthorized';
    return;
  }

  ctx.partner = PARTNERS[partnerName];
  await next();
};

const prepareLogBody = function (ctx) {
  return {
    reqId: ctx.get('X-Request-Id'),
    url: ctx.originalUrl,
    method: ctx.method,
    ip: ctx.ip,
    req: {
      query: ctx.request.query,
      params: ctx.request.params,
      body: ctx.request.body,
    },
    res: {
      status: ctx.status,
      body: ctx.body
    }
  };
};

const requestHandler = async function (ctx, next) {
  //handle router response
  ctx.log = log; //set to context in case it has to be used in side routes, services or data

  const reqId = uuid.v4();
  ctx.set('X-Request-Id', reqId);

  try {
    await next();
  } catch(err) {
    const status = err.status || 500;
    ctx.status = status;
    ctx.body = JSON.stringify([{
      code: status,
      msg: err.expose ? err.message : statuses[status], //we don't need to expose all the error messages to client, so lets only return what makes sense for client
      reqId // send reqId in response to track the logs of the request
    }]);
    //in case we have to do some app specific error handling
    ctx.app.emit('error', err, ctx);
  }

  //senstive data can be omitted from req/res before logging
  ctx.log.info(prepareLogBody(ctx));
};

const initServer = function initServer({routes, configs}) {
  const PORT = configs.port;
  const app = new Koa();
  app
    .use(async (ctx, next) =>{
      ctx.configs = configs;
      await next();
    })
    .use(corsValidator) //set cors for validation of request origins and incoming/outgoing headers
    .use(koaLogger())
    .use(partnerAuthentication)
    .use(requestHandler)
    .use(routes.middleware());

  //handle un cought errors in the application
  app.on('error', (err, ctx) => {
    const logBody = prepareLogBody(ctx);
    logBody.err = err;
    if (err.status && err.status === 404) {
      ctx.log.info(logBody);
    } else if (err.status && err.status < 500) {
      ctx.log.warn(logBody);
    } else {
      ctx.log.error(logBody);
    }
  });

  //starting the server
  app.listen(PORT);
  console.log(`App listening on ${PORT}`);
};

module.exports = initServer;