#!/bin/sh
set -eu

OPENAPI_URL="https://apisix.zingdevelopers.com/process-runtime/v3/api-docs"
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEFAULT_REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../../../.." && pwd)
REPO_ROOT=${PROCESS_RUNTIME_REPO_ROOT:-$DEFAULT_REPO_ROOT}
TARGET="$REPO_ROOT/packages/client/api-docs-process-runtime.json"
TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/process-runtime-openapi.XXXXXX")
RAW_FILE="$TMP_DIR/openapi.raw.json"
FORMATTED_FILE="$TMP_DIR/openapi.json"

cleanup() {
  rm -rf -- "$TMP_DIR"
}
trap cleanup EXIT HUP INT TERM

curl --fail --silent --show-error --location \
  --retry 2 --retry-delay 1 --connect-timeout 10 --max-time 60 \
  --header 'Accept: application/json' \
  "$OPENAPI_URL" --output "$RAW_FILE"

node --input-type=commonjs - "$RAW_FILE" "$FORMATTED_FILE" <<'NODE'
const fs = require('node:fs');
const [input, output] = process.argv.slice(2);

let document;
try {
  document = JSON.parse(fs.readFileSync(input, 'utf8'));
} catch (error) {
  console.error(`Downloaded response is not valid JSON: ${error.message}`);
  process.exit(1);
}

if (!document || typeof document !== 'object' || Array.isArray(document)) {
  console.error('Downloaded JSON is not an object.');
  process.exit(1);
}
if (typeof document.openapi !== 'string' && typeof document.swagger !== 'string') {
  console.error('Downloaded JSON has neither an openapi nor swagger version.');
  process.exit(1);
}
if (!document.info || typeof document.info !== 'object') {
  console.error('Downloaded OpenAPI document has no info object.');
  process.exit(1);
}
if (!document.paths || typeof document.paths !== 'object' || Array.isArray(document.paths)) {
  console.error('Downloaded OpenAPI document has no paths object.');
  process.exit(1);
}

fs.writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
NODE

if [ -f "$TARGET" ] && cmp -s "$FORMATTED_FILE" "$TARGET"; then
  echo "OpenAPI contract is already current: $TARGET"
  exit 0
fi

mv -- "$FORMATTED_FILE" "$TARGET"
echo "Updated OpenAPI contract: $TARGET"
