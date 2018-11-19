'use strict';
const redis = require('redis');

/**
 * @function redisClient
 *
 * Creates an object containing the setter and getter for redis client.
 *
 * @param {object} redisConfigs - the object containing the ttl and connection info
 * sent to.
 *
 * @returns {object} An object containing the setter and getter for redis client.
 */
function redisClient(redisConfigs) {
  const client = redis.createClient(redisConfigs);

  /**
   * @function initClient
   *
   * Initializes redis client
   *
   * @returns {promise} A promise, resolved when the client is ready to server
   */
  const initClient = async function() {
    if(client.connected)
      return;

    return new Promise((res, rej) => {
      client.once('ready', function onReady(err) {
        if(err) {
          return rej('error on redis ready');
        }

        if(!client.connected) {
          return rej('error on redis ready - NOT connected');
        }

        res();
      });
    });
  };


  /**
   * @function setData
   *
   * Setter for redis data store. stores the data for configured ttl
   *
   * @returns {promise} A promise, resolved when the data is set
   */
  const setData = async function (key, data) {
    if(!key || !data)
      throw new Error('Key or data not defined');

    //if redis not connected then connect it
    await initClient();

    const args = [key];
    let dataStr = null;
    try {
      dataStr = JSON.stringify(data);
    }
    catch (err) {
      return new Error('error on set key - json stringify exception');
    }

    args.push(dataStr);
    args.push('EX', redisConfigs.ttl);

    return new Promise((res, rej) => {
      client.set(args, function (err) {
        if (err) {
          return rej(err);
        }

        res({success : true});
      });
    });
  };


  /**
   * @function getData
   *
   * Getter for redis data store. gets the data from the data store
   *
   * @returns {promise} A promise, resolved with data from data store when the data is retrieved
   */
  const getData = async function (key) {
    if(!key)
      throw new Error('Key not defined');

    //if redis not connected then connect it
    await initClient();

    return new Promise((res, rej) => {
      client.get(key, function (err, data) {
        if (err) {
          return rej(err);
        }

        if (!data) {
          return res();
        }

        let result = null;
        data = data.toString();
        try {
          result = JSON.parse(data);
        }
        catch (err) {
          return rej('error on get key - json parse exception');
        }

        res(result);
      });
    });
  };

  return {
    initClient,
    setData,
    getData
  }
}

module.exports = redisClient;