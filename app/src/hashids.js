const Hashids = require('hashids');
const config = require('./config');

const hashids = new Hashids(config.hashids.secret, 0, config.hashids.alphabet);

function encode(id) {
  return hashids.encode(id);
}

function decode(slug) {
  const decoded = hashids.decode(slug);
  return decoded.length > 0 ? decoded[0] : null;
}

module.exports = {
  encode,
  decode,
};
