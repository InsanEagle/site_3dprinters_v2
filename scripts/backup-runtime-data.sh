#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

RUNTIME_DIRS=(
  "data/orders"
  "data/requests"
  "data/request-attachments"
)

for runtime_dir in "${RUNTIME_DIRS[@]}"; do
  if [[ ! -d "${runtime_dir}" ]]; then
    echo "Missing runtime directory: ${runtime_dir}" >&2
    exit 1
  fi
done

mkdir -p backups

timestamp="$(date +%Y%m%d-%H%M%S)"
archive_path="backups/site-runtime-data-${timestamp}.tar.gz"

tar -czf "${archive_path}" "${RUNTIME_DIRS[@]}"

echo "Created backup: ${archive_path}"
