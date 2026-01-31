const express = require('express');
const config = require('./config');
const { connect, insertShortLink, getLongUrl } = require('./cassandra');
const { getNextId, incrementClickCount, getClickCount } = require('./redis');
const { encode } = require('./hashids');

const app = express();
app.use(express.json());

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

app.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid url' });
    }
    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const id = await getNextId();
    const slug = encode(id);
    await insertShortLink(slug, trimmed);

    const shortUrl = `${config.baseUrl.replace(/\/$/, '')}/${slug}`;
    return res.status(201).json({ shortUrl, slug, longUrl: trimmed });
  } catch (err) {
    console.error('Shorten error:', err);
    return res.status(500).json({ error: 'Failed to create short link' });
  }
});

app.get('/stats/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const clicks = await getClickCount(slug);
    return res.json({ slug, clicks });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await getLongUrl(slug);
    const row = result.rows[0];
    if (!row || !row.long_url) {
      return res.status(404).json({ error: 'Not found' });
    }
    await incrementClickCount(slug);
    return res.redirect(301, row.long_url);
  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).json({ error: 'Failed to resolve link' });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener',
    endpoints: {
      'POST /shorten': 'Body: { "url": "https://..." } → returns { shortUrl, slug }',
      'GET /:slug': 'Redirects to the long URL (counts click in Redis)',
      'GET /stats/:slug': 'Returns { slug, clicks } from Redis',
    },
  });
});

async function start() {
  await require('./cassandra').createKeyspaceAndTable();
  await connect();
  app.listen(config.port, () => {
    console.log(`Server running at ${config.baseUrl}`);
  });
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
