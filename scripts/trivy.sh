#!/usr/bin/env bash
# Run Trivy security scans (uses Docker; no local Trivy install needed).
# Usage: ./scripts/trivy.sh [config|fs|image|all]   (default: all)
# Output is written to stdout and to a log file under logs/ (override with TRIVY_LOG_FILE).

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TRIVY_IMAGE="${TRIVY_IMAGE:-aquasec/trivy:latest}"

mkdir -p "$ROOT_DIR/logs"
LOG_FILE="${TRIVY_LOG_FILE:-$ROOT_DIR/logs/trivy-$(date +%Y%m%d-%H%M%S).log}"
exec > >(tee "$LOG_FILE") 2>&1
echo "Log: $LOG_FILE"
echo ""

run_config() {
  echo "=== Trivy config (Dockerfile, docker-compose) ==="
  docker run --rm \
    -v "$ROOT_DIR:/app" -w /app \
    "$TRIVY_IMAGE" config /app
}

run_fs() {
  echo "=== Trivy fs – app/ (dependencies) ==="
  docker run --rm \
    -v "$ROOT_DIR/app:/app" -w /app \
    "$TRIVY_IMAGE" fs --scanners vuln /app

  echo ""
  echo "=== Trivy fs – frontend/ (dependencies) ==="
  docker run --rm \
    -v "$ROOT_DIR/frontend:/app" -w /app \
    "$TRIVY_IMAGE" fs --scanners vuln /app
}

run_image() {
  echo "=== Trivy image (requires built images) ==="
  for name in url-shortener-app url-shortener-frontend; do
    if docker image inspect "$name" &>/dev/null; then
      echo "--- $name ---"
      docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
        "$TRIVY_IMAGE" image "$name"
    else
      echo "Image $name not found. Build with: docker compose build app frontend"
    fi
  done
}

case "${1:-all}" in
  config) run_config ;;
  fs)     run_fs ;;
  image)  run_image ;;
  all)
    run_config
    echo ""
    run_fs
    echo ""
    run_image
    ;;
  *)
    echo "Usage: $0 [config|fs|image|all]"
    echo "  config  – Dockerfiles + docker-compose misconfig"
    echo "  fs      – app/ and frontend/ dependency vulnerabilities"
    echo "  image   – built Docker images (run after docker compose build)"
    echo "  all     – config + fs + image (default)"
    exit 1
    ;;
esac
