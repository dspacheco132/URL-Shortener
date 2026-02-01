# Cassandra DB - Docker

Docker setup to run Apache Cassandra.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

### Start Cassandra

```bash
docker compose up -d
```

Cassandra takes about 30–60 seconds to become ready. Port **9042** is used for CQL (Cassandra Query Language) connections. Redis is available on port **6379**.

### Check if it's running

```bash
docker compose ps
docker compose logs -f cassandra
```

### Connect via cqlsh (inside the container)

```bash
docker compose exec cassandra cqlsh
```

### Connect to Redis (redis-cli)

```bash
docker compose exec redis redis-cli
```

**INCR counter:** inside `redis-cli` (or from your app):

```bash
INCR counter
# Returns the new value (1, 2, 3, ...) — atomic
```

### Stop

```bash
docker compose down
```

### Stop and remove data

```bash
docker compose down -v
```

## Connection

### Cassandra

- **Host:** `localhost`
- **Port:** `9042`
- **Protocol:** CQL (binary)

Example connection string for applications: `localhost:9042`

### Redis

- **Host:** `localhost`
- **Port:** `6379`

Use `INCR counter` (or any key name) to get an atomic increment; the command returns the new value. Ideal for generating unique IDs (e.g. for a URL shortener).

## URL Shortener app

The `app/` folder contains a URL shortener that uses:

- **Cassandra** — stores `slug → long_url`
- **Redis** — `INCR url_counter` for unique IDs
- **Hashids** — encodes the ID with a secret + custom base62 alphabet (only the app can decode)

### Run with Docker Compose

```bash
docker compose up -d
```

- **Frontend (Next.js):** http://localhost:8080 — UI for shortening URLs; API calls are proxied server-side to the backend
- **Backend (API):** http://localhost:3000 — shorten endpoint, redirects, stats

### Run the app locally (Cassandra + Redis must be up)

```bash
cd app
./create-env.sh        # creates .env with generated SECRET_KEY (or: cp .env.example .env)
npm install
npm run dev
```

To create `.env` with a random secret and optional shuffled alphabet:

```bash
./app/create-env.sh                              # default BASE_URL=http://localhost:3000
BASE_URL=https://short.example.com ./app/create-env.sh   # production base URL
SHUFFLE_ALPHABET=1 ./app/create-env.sh          # random base62 alphabet
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| POST | `/shorten` | Body: `{ "url": "https://..." }` → returns `{ shortUrl, slug }` |
| GET | `/:slug` | Redirects to the long URL (301); counts click in Redis |
| GET | `/stats/:slug` | Returns `{ slug, clicks }` (clicks stored in Redis) |

Click counts are stored only in Redis (key `clicks:<slug>`), so redirects do not write to Cassandra.

### Example

```bash
curl -X POST http://localhost:3000/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com"}'
# → { "shortUrl": "http://localhost:3000/2tx", "slug": "2tx", "longUrl": "https://example.com" }

curl -I http://localhost:3000/2tx
# → 301 redirect to https://example.com

curl http://localhost:3000/stats/2tx
# → { "slug": "2tx", "clicks": 5 }
```

### Production: generating secure variables

Use strong, random values for production. **Never commit `.env`**; use a secrets manager or your platform’s env config.

**SECRET_KEY** (long random string; required for Hashids):

```bash
# Option 1: OpenSSL (32 bytes = 64 hex chars)
openssl rand -hex 32

# Option 2: Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**BASE62_ALPHABET** (optional; custom order = different slugs, only your app can decode):

- Keep default: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`
- Or shuffle once and store the same value everywhere (e.g. generate with a script and put in env):

```bash
node -e "const a='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} console.log(a.join(''))"
```

**Production checklist:**

| Variable | Example / tip |
|----------|-------------------------------|
| `SECRET_KEY` | Output of `openssl rand -hex 32` |
| `BASE_URL` | `https://your-domain.com` |
| `BASE62_ALPHABET` | Default or one shuffled value (same everywhere) |
| `CASSANDRA_HOST` | Your Cassandra host (e.g. `cassandra` in Docker, or cluster address) |
| `REDIS_HOST` | Your Redis host |
| `CASSANDRA_KEYSPACE` | e.g. `url_shortener` (can keep) |
| `REDIS_COUNTER_KEY` | e.g. `url_counter` (can keep) |

If you change `SECRET_KEY` or `BASE62_ALPHABET` after going live, existing short links will no longer decode correctly; set them once and keep them stable.

## Frontend (Next.js)

The `frontend/` folder contains a Next.js app that provides the UI. It proxies requests to the backend via API routes (`/api/shorten`, `/api/stats/[slug]`), so the browser never talks directly to the backend.

### Run frontend locally (backend + Cassandra + Redis must be up)

```bash
cd frontend
cp .env.example .env   # Edit BACKEND_URL if needed (default: http://localhost:3000)
npm install
npm run dev
```

Frontend runs at **http://localhost:20002**.

### Environment

| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | Backend API base URL. Local: `http://localhost:3000`, Docker: `http://app:3000` |
| `FRONTEND_URL` | Public URL of the frontend (for redirects). Production: `https://lnk.diogopacheco.com`; prevents redirects to 0.0.0.0 |

## Data

Data is persisted in the `cassandra_data` and `redis_data` volumes. Even after stopping the containers, data is kept until you run `docker compose down -v`.
