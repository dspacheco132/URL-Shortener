# lnk. — URL Shortener

A modern URL shortener built with **Next.js**, **Express**, **Apache Cassandra**, and **Redis**. Short links use Hashids for compact, obfuscated slugs.

## Features

- **Shorten URLs** — Paste any URL and get a short link instantly
- **Click analytics** — View click counts per short link
- **Responsive UI** — Mobile-friendly interface with dark mode support
- **i18n** — Multi-language support (EN/PT)
- **SEO** — Sitemap, robots.txt, Open Graph metadata

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express |
| Database | Apache Cassandra (slug → long URL mapping) |
| Cache/Counter | Redis (atomic ID generation, click counts) |
| Slug encoding | Hashids (base62, secret + custom alphabet) |

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Express   │────▶│  Cassandra  │
│  (port 8080)│     │  (port 3000)│     │  (port 9042)│
└─────────────┘     └──────┬──────┘     └─────────────┘
       │                   │
       │                   └──────────▶ ┌─────────────┐
       │                                │    Redis    │
       └── API routes proxy to backend  │  (port 6379)│
                                        └─────────────┘
```

The frontend proxies API requests to the backend via Next.js API routes. Cassandra stores `slug → long_url`; Redis provides atomic counters for IDs and click tracking.

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js 20.x (for local development)

### Run with Docker (recommended)

```bash
docker compose up -d
```

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:20002 | 20002 |
| Backend API | http://localhost:3000 | 3000 |
| Cassandra | — | 9042 |
| Redis | — | 6379 |

Services take 30–60 seconds to become ready. Cassandra runs a healthcheck before the app starts.

### Run locally (development)

1. **Start databases:**
   ```bash
   docker compose up -d cassandra redis
   ```

2. **Backend:**
   ```bash
   cd app
   ./create-env.sh   # creates .env with SECRET_KEY
   npm install && npm run dev
   ```
   → http://localhost:3000

3. **Frontend:**
   ```bash
   cd frontend
   cp .env.example .env
   npm install && npm run dev
   ```
   → http://localhost:8080

## Project Structure

```
URL-Shortener/
├── app/                 # Express backend
│   ├── src/
│   │   ├── index.js     # API server
│   │   ├── cassandra.js # Cassandra client
│   │   ├── redis.js     # Redis client
│   │   ├── hashids.js   # Slug encoding
│   │   └── init-db.js   # Schema setup
│   ├── create-env.sh    # Generate .env
│   └── Dockerfile
├── frontend/            # Next.js app
│   ├── src/app/         # App Router pages & API routes
│   ├── src/components/
│   └── Dockerfile
├── scripts/
│   └── trivy.sh         # Security scan
├── docker-compose.yml
└── .github/workflows/
    └── ci-cd.yml        # CI pipeline
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info and endpoints |
| POST | `/shorten` | `{ "url": "https://..." }` → `{ shortUrl, slug, longUrl }` |
| GET | `/:slug` | Redirect to long URL (counts click in Redis) |
| GET | `/stats/:slug` | `{ slug, clicks }` |

### Example

```bash
# Shorten a URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# → { "shortUrl": "http://localhost:3000/2tx", "slug": "2tx", "longUrl": "https://example.com" }

# Redirect
curl -I http://localhost:3000/2tx
# → 307 redirect to https://example.com

# Stats
curl http://localhost:3000/stats/2tx
# → { "slug": "2tx", "clicks": 5 }
```

## Environment Variables

### Backend (`app/`)

| Variable | Description | Example |
|----------|-------------|---------|
| `CASSANDRA_HOST` | Cassandra host | `localhost` / `cassandra` (Docker) |
| `CASSANDRA_PORT` | Cassandra port | `9042` |
| `CASSANDRA_KEYSPACE` | Keyspace name | `url_shortener` |
| `REDIS_HOST` | Redis host | `localhost` / `redis` (Docker) |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_COUNTER_KEY` | Key for atomic ID counter | `url_counter` |
| `SECRET_KEY` | Hashids secret (required) | `openssl rand -hex 32` |
| `BASE62_ALPHABET` | Custom base62 alphabet (optional) | default: `0-9a-zA-Z` |
| `BASE_URL` | Base URL for short links | `https://lnk.example.com` |
| `PORT` | Server port | `3000` |

### Frontend (`frontend/`)

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | Backend API URL | `http://localhost:3000` / `http://app:3000` (Docker) |
| `FRONTEND_URL` | Public frontend URL (for redirects) | `https://lnk.example.com` |

### Generate production secrets

```bash
# SECRET_KEY
openssl rand -hex 32

# Optional: shuffle base62 alphabet (stored once, same everywhere)
node -e "const a='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} console.log(a.join(''))"
```

> **Warning:** Changing `SECRET_KEY` or `BASE62_ALPHABET` after deployment will break existing short links.

## CI/CD

GitHub Actions runs on `push` and `pull_request` to `main`, `master`, and `develop`:

- **test-app** — `npm ci`, `npm audit` for backend
- **test-frontend** — `npm ci`, `npm audit`, `npm run lint`, type check, `npm run build`
- **security-scan** — Trivy (vuln, secret, config); results uploaded to GitHub Security (SARIF)

## Security (Trivy)

Run Trivy locally via the script (uses Docker; no local Trivy needed):

```bash
./scripts/trivy.sh          # config + fs + image
./scripts/trivy.sh config   # Dockerfiles, docker-compose
./scripts/trivy.sh fs       # app/ and frontend/ dependencies
./scripts/trivy.sh image    # built images (after docker compose build)
```

Logs are written to `logs/trivy-YYYYMMDD-HHMMSS.log`.

## Database

### Cassandra

- **CQL port:** 9042
- **Connect:** `docker compose exec cassandra cqlsh`

### Redis

- **Port:** 6379
- **Connect:** `docker compose exec redis redis-cli`
- **Atomic counter:** `INCR url_counter` (returns new value)

### Persistence

Data is stored in `cassandra_data` and `redis_data` Docker volumes. Remove with:

```bash
docker compose down -v
```

## License

MIT
