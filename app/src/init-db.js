const { createKeyspaceAndTable } = require('./cassandra');

async function main() {
  try {
    await createKeyspaceAndTable();
    console.log('Keyspace and table created successfully.');
  } catch (err) {
    console.error('Init failed:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

main();
