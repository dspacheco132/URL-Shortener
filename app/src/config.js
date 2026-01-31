require('dotenv').config();

module.exports = {
  cassandra: {
    host: process.env.CASSANDRA_HOST || 'localhost',
    port: parseInt(process.env.CASSANDRA_PORT || '9042', 10),
    keyspace: process.env.CASSANDRA_KEYSPACE || 'url_shortener',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    counterKey: process.env.REDIS_COUNTER_KEY || 'url_counter',
  },
  hashids: {
    secret: process.env.SECRET_KEY || 'default-secret-change-me',
    alphabet: process.env.BASE62_ALPHABET || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  port: parseInt(process.env.PORT || '3000', 10),
};
