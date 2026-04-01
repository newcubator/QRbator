#!/usr/bin/env bash
# build-and-deploy.sh
# Builds the app locally (no EAS cloud minutes) and submits to app stores.
#
# Usage:
#   ./scripts/build-and-deploy.sh [platform] [--skip-submit]
#
#   platform: ios | android | all  (default: all)
#   --skip-submit: build only, do not submit to stores
#
# Requirements:
#   - eas-cli installed globally: npm install -g eas-cli
#   - Logged in: eas login
#   - iOS: Xcode + valid Apple credentials configured via: eas credentials
#   - Android: Android SDK + keystore configured via: eas credentials

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PROFILE="production"
BUILD_DIR="./build-output"
IOS_OUTPUT="$BUILD_DIR/app.ipa"
ANDROID_OUTPUT="$BUILD_DIR/app.aab"

# ── Argument parsing ──────────────────────────────────────────────────────────
PLATFORM="${1:-all}"
SKIP_SUBMIT=false

for arg in "$@"; do
  if [[ "$arg" == "--skip-submit" ]]; then
    SKIP_SUBMIT=true
  fi
done

# Normalize platform arg (strip leading --)
PLATFORM="${PLATFORM#--}"

if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" && "$PLATFORM" != "all" ]]; then
  echo "❌ Unknown platform: $PLATFORM. Use: ios | android | all"
  exit 1
fi

# ── Helpers ───────────────────────────────────────────────────────────────────
log()  { echo "▶ $*"; }
ok()   { echo "✔ $*"; }
fail() { echo "✘ $*" >&2; exit 1; }

require_cmd() {
  command -v "$1" &>/dev/null || fail "$1 is not installed. Run: npm install -g eas-cli"
}

# ── Pre-flight ────────────────────────────────────────────────────────────────
require_cmd eas
require_cmd node

log "Running tests before build..."
npm run testFinal -- --passWithNoTests || fail "Tests failed. Fix them before deploying."

mkdir -p "$BUILD_DIR"

# ── Build functions ───────────────────────────────────────────────────────────
build_ios() {
  log "Building iOS locally (profile: $PROFILE)..."
  eas build \
    --platform ios \
    --profile "$PROFILE" \
    --local \
    --output "$IOS_OUTPUT" \
    --non-interactive
  ok "iOS build complete → $IOS_OUTPUT"
}

build_android() {
  log "Building Android locally (profile: $PROFILE)..."
  eas build \
    --platform android \
    --profile "$PROFILE" \
    --local \
    --output "$ANDROID_OUTPUT" \
    --non-interactive
  ok "Android build complete → $ANDROID_OUTPUT"
}

# ── Submit functions ──────────────────────────────────────────────────────────
submit_ios() {
  [[ -f "$IOS_OUTPUT" ]] || fail "iOS artifact not found at $IOS_OUTPUT"
  log "Submitting iOS build to App Store Connect..."
  eas submit \
    --platform ios \
    --profile "$PROFILE" \
    --path "$IOS_OUTPUT" \
    --non-interactive
  ok "iOS submitted to TestFlight / App Store Connect."
}

submit_android() {
  [[ -f "$ANDROID_OUTPUT" ]] || fail "Android artifact not found at $ANDROID_OUTPUT"
  log "Submitting Android build to Google Play..."
  eas submit \
    --platform android \
    --profile "$PROFILE" \
    --path "$ANDROID_OUTPUT" \
    --non-interactive
  ok "Android submitted to Google Play."
}

# ── Main ──────────────────────────────────────────────────────────────────────
case "$PLATFORM" in
  ios)
    build_ios
    $SKIP_SUBMIT || submit_ios
    ;;
  android)
    build_android
    $SKIP_SUBMIT || submit_android
    ;;
  all)
    build_ios
    build_android
    if ! $SKIP_SUBMIT; then
      submit_ios
      submit_android
    fi
    ;;
esac

ok "Done! 🎉"
