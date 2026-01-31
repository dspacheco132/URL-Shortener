const cassandra = require('cassandra-driver');
const config = require('./config');

const client = new cassandra.Client({
  contactPoints: [config.cassandra.host],
  localDataCenter: 'datacenter1',
  keyspace: config.cassandra.keyspace,
});

async function connect() {
  await client.connect();
  return client;
}

async function createKeyspaceAndTable() {
  const adminClient = new cassandra.Client({
    contactPoints: [config.cassandra.host],
    localDataCenter: 'datacenter1',
  });
  await adminClient.connect();

  await adminClient.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${config.cassandra.keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
  `);

  await adminClient.execute(`
    CREATE TABLE IF NOT EXISTS ${config.cassandra.keyspace}.short_links (
      slug text PRIMARY KEY,
      long_url text,
      created_at timestamp
    )
  `);

  await adminClient.shutdown();
}

function insertShortLink(slug, longUrl) {
  const query = 'INSERT INTO short_links (slug, long_url, created_at) VALUES (?, ?, ?)';
  return client.execute(query, [slug, longUrl, new Date()], { prepare: true });
}

function getLongUrl(slug) {
  const query = 'SELECT long_url FROM short_links WHERE slug = ?';
  return client.execute(query, [slug], { prepare: true });
}

module.exports = {
  client,
  connect,
  createKeyspaceAndTable,
  insertShortLink,
  getLongUrl,
};
