const redis = require('redis')
const { REDIS } = require('../configuration/config');
const { CASHING_KEY_NAME } = require('../configuration/constants/cacheConstants');
let redisClient

/**
 * Connect to Radis server
 * @returns {Promise<RedisClient<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts> & WithCommands & WithModules<RedisDefaultModules & RedisModules> & WithFunctions<RedisFunctions> & WithScripts<RedisScripts>>}
 */
async function createRedisServer() {
    redisClient = redis.createClient({
        url: `redis://${REDIS.USER}${REDIS.PASSWORD}${REDIS.HOST}:${REDIS.PORT}`
    });
    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    await redisClient.connect();
    logger.info("Redis Service Connected.");
    return redisClient
}

/**
 * convert data into string. store into string
 * @param key
 * @param data
 * @returns {Promise<void>}
 */
async function storeCachingData(key, data) {
    if(key && data)
        await redisClient.set(key, JSON.stringify(data))
}

/**
 * Set Expire time for key to delete data
 * @param key
 * @param time
 * @returns {Promise<void>}
 */
async function setExpireTime(key, time) {
    if(key && time)
        await redisClient.expire(key, time)
}

/**
 * Caching middleWare that check if in header cashing key is found then send caching data otherwise give send to controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function getCachingDataMiddleware(req, res, next) {
    try {
        const cashingKey = req.headers[CASHING_KEY_NAME];
        if (!cashingKey) {
            return next()
        }
        let data = await redisClient.get(cashingKey);
        if (data) {
            try {
                data = JSON.parse(data)
                return utils.successResponse(data, res)
            } catch (e) {
                logger.error("wrong JSON formats found getCachingDataMiddleware")
            }
        }
        next()
    } catch (error) {
        logger.error("Error in redis caching", error)
        next()
    }

}

/**
 * GET the caching data for key
 * @param cashingKey
 * @returns {Promise<null|*>}
 */
async function getCachingData(cashingKey) {
    try {
        return await redisClient.get(cashingKey);
    } catch (e) {
        logger.debug("Error getCachingData in redis caching")
        return null
    }
}

module.exports = {
    createRedisServer,
    storeCachingData,
    getCachingData,
    getCachingDataMiddleware,
    setExpireTime
}

