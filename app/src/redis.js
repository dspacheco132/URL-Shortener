const Redis = require('ioredis');
const config = require('./config');

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

const CLICKS_PREFIX = 'clicks:';

async function getNextId() {
  const id = await redis.incr(config.redis.counterKey);
  return id;
}

function clicksKey(slug) {
  return `${CLICKS_PREFIX}${slug}`;
}

async function incrementClickCount(slug) {
  return redis.incr(clicksKey(slug));
}

async function getClickCount(slug) {
  const value = await redis.get(clicksKey(slug));
  return value ? parseInt(value, 10) : 0;
}

module.exports = {
  redis,
  getNextId,
  incrementClickCount,
  getClickCount,
};
