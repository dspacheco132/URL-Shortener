#!/usr/bin/env bash
# Creates app/.env with generated SECRET_KEY and optional custom BASE62_ALPHABET.
# Run from repo root: ./app/create-env.sh
# Or from app/: ./create-env.sh
#
# Override defaults when running:
#   BASE_URL=https://short.example.com ./app/create-env.sh
#   SHUFFLE_ALPHABET=1 ./app/create-env.sh   # use a random shuffled alphabet

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

# Defaults (override with env vars when running the script)
CASSANDRA_HOST="${CASSANDRA_HOST:-localhost}"
CASSANDRA_PORT="${CASSANDRA_PORT:-9042}"
CASSANDRA_KEYSPACE="${CASSANDRA_KEYSPACE:-url_shortener}"
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_COUNTER_KEY="${REDIS_COUNTER_KEY:-url_counter}"
BASE_URL="${BASE_URL:-http://localhost:3000}"
PORT="${PORT:-3000}"

# Generate SECRET_KEY (32 bytes hex)
if command -v openssl &>/dev/null; then
  SECRET_KEY="$(openssl rand -hex 32)"
else
  echo "Warning: openssl not found, using fallback. Install openssl for secure keys."
  SECRET_KEY="$(head -c 32 /dev/urandom 2>/dev/null | xxd -p -c 32 || echo "change-me-$(date +%s)")"
fi

# BASE62_ALPHABET: default or shuffled
DEFAULT_ALPHABET="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
if [ "${SHUFFLE_ALPHABET}" = "1" ]; then
  BASE62_ALPHABET="$(node -e "
    const a = '${DEFAULT_ALPHABET}'.split('');
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    console.log(a.join(''));
  " 2>/dev/null)" || BASE62_ALPHABET="${DEFAULT_ALPHABET}"
else
  BASE62_ALPHABET="${DEFAULT_ALPHABET}"
fi

cat > "${ENV_FILE}" << EOF
# Cassandra
CASSANDRA_HOST=${CASSANDRA_HOST}
CASSANDRA_PORT=${CASSANDRA_PORT}
CASSANDRA_KEYSPACE=${CASSANDRA_KEYSPACE}

# Redis (INCR counter)
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_COUNTER_KEY=${REDIS_COUNTER_KEY}

# Hashids: secret + custom base62 alphabet (only the app can decode)
SECRET_KEY=${SECRET_KEY}
BASE62_ALPHABET=${BASE62_ALPHABET}

# Base URL for short links
BASE_URL=${BASE_URL}

# Server
PORT=${PORT}
EOF

echo "Created ${ENV_FILE} with generated SECRET_KEY."
echo "Override next time with: BASE_URL=https://your-domain.com ./app/create-env.sh"
