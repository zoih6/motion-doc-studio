#!/usr/bin/env bash
# Renderer setup (idempotent). Set MDS_SOUND=1 for uv/SOUND LAYER; MDS_ANALYSIS=1 for Python analysis.
set -e
cd "$(dirname "$0")/.."   # repo / project root (works from any cwd)
command -v ffmpeg >/dev/null || { sudo apt-get update -qq >/dev/null 2>&1; sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg >/tmp/apt.log 2>&1; }
[ -d node_modules/playwright ] || npm i --no-audit --no-fund >/dev/null 2>&1
ls ~/.cache/ms-playwright 2>/dev/null | grep -q chromium || { npx playwright install chromium >/dev/null 2>&1; sudo npx playwright install-deps chromium >/tmp/deps.log 2>&1 || true; }
# Optional SOUND LAYER runtime. Do not install analysis libraries for ordinary renders.
export PATH="$HOME/.local/bin:$PATH"
if [ "${MDS_SOUND:-0}" = 1 ]; then
  command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1 || true
fi
if [ "${MDS_ANALYSIS:-0}" = 1 ] || [ "${FULL:-0}" = 1 ]; then
  python3 -c "import numpy, PIL" 2>/dev/null || pip install -q numpy pillow >/dev/null 2>&1 || pip install -q --break-system-packages numpy pillow >/dev/null 2>&1 || true
fi
[ "${FULL:-0}" = 1 ] && { pip install -q opencv-python-headless scikit-learn >/dev/null 2>&1 || pip install -q --break-system-packages opencv-python-headless scikit-learn >/dev/null 2>&1 || true; }
echo "setup ok: $(ffmpeg -version | head -1 | cut -c1-30), node $(node -v), $(uv --version 2>/dev/null || echo 'uv skipped; set MDS_SOUND=1 for sound')"
