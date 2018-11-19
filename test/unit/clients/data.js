'use strict';

(function () {
  const request = {
    get: async function get() {},
    post: async function get() {}
  };
  const cacheClients = {
    redis: {
      setData: async function setData(key, data) {},
      getData: async function getData(key) {}
    }
  };

  const ctx = {
    partner: {
      apiBaseUrl: "https://www.ounass.ae/"
    }
  };

  let dataClient = require('../../../clients/data')({request, cacheClients, configs});

  let getReq;
  let postReq;
  let getRedis;
  let setRedis;
  describe('Testing Data Client', function () {
    beforeEach(() => {
      getReq = sinon.stub(request, 'get');
      postReq = sinon.stub(request, 'post');
      getRedis = sinon.stub(cacheClients.redis, 'getData');
      setRedis = sinon.stub(cacheClients.redis, 'setData');
    });

    afterEach(() => {
      sinon.restore();
      dataClient = require('../../../clients/data')({request, cacheClients, configs});
    });

    describe('Get Data', function () {
      describe('params validations', function () {
        it('Should throw exception--because ctx is not provided', async function () {
          try {
            await dataClient.get();
          } catch (e) {
            expect(e.message).to.equal('No ctx or invalid ctx object provided');
          }
        });
        it('Should throw exception--because url is not provided', async function () {
          try {
            await dataClient.get(ctx);
          } catch (e) {
            expect(e.message).to.equal('url not provided or its invalid.');
          }
        });
        it('Should throw exception--because method is not provided', async function () {
          try {
            await dataClient.get(ctx, 'products');
          } catch (e) {
            expect(e.message).to.equal('method not provided or its invalid.');
          }
        });
      });

      describe('cache disabled', function () {
        const configs = {
          "cache": {
            "enabled": false,
            "store": "redis",
            "ttl": 3600,
            "redis": {
              "host": "localhost",
              "port": 6379
            }
          }
        };
        dataClient = require('../../../clients/data')({request, cacheClients, configs});
        it('Should return data from request client', async function () {
          try {
            const fromRequest = 'fromRequest';
            getReq.returns(Promise.resolve({
              statusCode: 200,
              body: fromRequest
            }));
            let dataResp = await dataClient.get(ctx, 'product', 'get');
            expect(dataResp).to.equal(fromRequest);
          } catch (e) {
            expect(e).not.to.exist();
          }
        });
        it('Should return data from request client', async function () {
          try {
            getReq.returns(Promise.resolve({
              statusCode: 400,
              body: 'bad request'
            }));
            let dataResp = await dataClient.get(ctx, 'product', 'get');
            expect(dataResp).to.equal(null);
          } catch (e) {
            expect(e).not.to.exist();
          }
        });
      });

      describe('cache enabled', function () {
        const configs = {
          "cache": {
            "enabled": true,
            "store": "redis",
            "ttl": 3600,
            "redis": {
              "host": "localhost",
              "port": 6379
            }
          }
        };
        const fromRequest = 'fromRequest';
        const fromRedis = 'fromRedis';
        dataClient = require('../../../clients/data')({request, cacheClients, configs});
        it('Should return data from request client, because its not saved in cache', async function () {
          try {
            getReq.returns(Promise.resolve({
              statusCode: 200,
              body: fromRequest
            }));
            getRedis.returns(Promise.resolve(null));
            let dataResp = await dataClient.get(ctx, 'product', 'get');
            expect(dataResp).to.equal(fromRequest);
          } catch (e) {
            expect(e).not.to.exist();
          }
        });
        it('Should return data from cache client', async function () {
          try {
            getReq.returns(Promise.resolve({
              statusCode: 400,
              body: 'bad request'
            }));
            getRedis.returns(Promise.resolve(fromRedis));
            let dataResp = await dataClient.get(ctx, 'product', 'get');
            expect(dataResp).to.equal(fromRedis);
          } catch (e) {
            expect(e).not.to.exist();
          }
        });
      });
    });
  });
})();