#!/bin/bash
# openclaw-mac-bootstrap.sh
# ─────────────────────────────────────────────────────────────────
# Bring a NEW Mac (e.g. Ak's MacBook Pro) to lane-parity with the
# Mac mini: 5 standing Claude Code sessions (Deuce / Monique /
# Aubrey / Gam / Linda) attached via /remote-control + the
# cross-lane inbox tree + zsh aliases.
#
# Idempotent — safe to run multiple times.
#
# What this DOES NOT install (Mac mini only, single-instance):
#   • Monique daemon launchd jobs (video-generator, idea-loop)
#   • Linda 3AM sweep launchd job
#   • Gamble messages monitor (reads iMessages from Mac mini)
#   • Lane auto-spawn on reboot (LaunchAgent) — Stage 2 if wanted
#
# Usage on the new Mac:
#   cd ~/Documents/GitHub/digital-bloom
#   git pull origin main
#   bash scripts/openclaw-mac-bootstrap.sh
# ─────────────────────────────────────────────────────────────────

set -u

OPENCLAW="$HOME/.openclaw"
LANES=(deuce monique aubrey gam linda)

echo "═══ OpenClaw lane bootstrap — $(scutil --get ComputerName 2>/dev/null || hostname) ═══"
echo ""

# 1. Verify claude CLI is available
echo "→ Checking claude CLI..."
if ! command -v claude >/dev/null 2>&1; then
  echo "  ✗ claude CLI not found on PATH."
  echo ""
  echo "  Install Claude Code first:"
  echo "    https://docs.claude.com/claude-code/quickstart"
  echo "  Or run:"
  echo "    curl -fsSL https://claude.ai/install.sh | bash"
  echo ""
  echo "  Then re-run this script."
  exit 1
fi
echo "  ✓ claude → $(command -v claude)"

# 2. Build the openclaw directory tree
echo ""
echo "→ Creating ~/.openclaw tree..."
mkdir -p "$OPENCLAW"/{bin,scripts,logs,completions}
for lane in "${LANES[@]}"; do
  mkdir -p "$OPENCLAW/inbox/$lane"
  mkdir -p "$OPENCLAW/inbox/_read/$lane"
done
echo "  ✓ inbox/{${LANES[*]// /,}} + _read/ archives"
echo "  ✓ bin/ scripts/ logs/ completions/"

# 3. Write the portable spawn-lanes.sh
echo ""
echo "→ Writing ~/.openclaw/bin/spawn-lanes.sh..."
cat > "$OPENCLAW/bin/spawn-lanes.sh" <<'SPAWN_EOF'
#!/bin/bash
# Spawn the 5 standing Claude Code lanes on this Mac and register each
# with /remote-control so they appear in Ak's iOS Code tab.
#
# Run after a reboot, when `screen -ls` is short, or to reset a wedged lane.
#   ~/.openclaw/bin/spawn-lanes.sh

set -u
LANES=(deuce monique aubrey gam linda)
label_for() {
  case "$1" in
    deuce)   echo Deuce ;;
    monique) echo Monique ;;
    aubrey)  echo Aubrey ;;
    gam)     echo Gam ;;
    linda)   echo Linda ;;
  esac
}

echo "→ Killing any existing lane sessions..."
for s in "${LANES[@]}"; do
  screen -S ${s}-session -X quit 2>/dev/null && echo "  killed ${s}-session"
done
sleep 2

cd "$HOME" || exit 1

echo "→ Spawning fresh lanes..."
for s in "${LANES[@]}"; do
  label="$(label_for "$s")"
  screen -dmS ${s}-session bash -lc "exec claude '/remote-control ${label}'"
  echo "  spawned ${s}-session  (label: ${label})"
done

echo "→ Waiting for Claude to boot in each (≈25s)..."
sleep 25

echo "→ Verifying registration..."
all_ok=1
for s in "${LANES[@]}"; do
  tmp=$(mktemp)
  screen -S ${s}-session -p 0 -X hardcopy -h "$tmp"
  label="$(label_for "$s")"
  if grep -aqF "Remote Control active" "$tmp"; then
    sid=$(grep -aoE "session_[A-Za-z0-9]+" "$tmp" | head -1)
    echo "  ✓ ${label}  ${sid}"
  else
    echo "  ✗ ${label}  NOT REGISTERED — attach with: screen -r ${s}-session"
    all_ok=0
  fi
  rm -f "$tmp"
done

echo ""
if [[ $all_ok -eq 1 ]]; then
  echo "All 5 lanes live. Open Claude iOS app → Code tab to attach from your phone."
else
  echo "One or more lanes failed. Re-run this script or attach manually with screen -r."
fi
SPAWN_EOF
chmod +x "$OPENCLAW/bin/spawn-lanes.sh"
echo "  ✓ spawn-lanes.sh installed"

# 4. Patch ~/.zshrc with aliases (idempotent)
echo ""
echo "→ Adding lane aliases to ~/.zshrc..."
ZRC="$HOME/.zshrc"
touch "$ZRC"
if grep -q "# OpenClaw lane aliases" "$ZRC"; then
  echo "  ✓ aliases already present — skipping"
else
  cat >> "$ZRC" <<'ZRC_EOF'

# OpenClaw lane aliases
# Attach to a running lane:    deuce / monique / aubrey / gam / linda
# Detach (leave it running):   Ctrl-A  then  D
# List all lanes:              lanes
# Re-spawn all lanes:          spawn-lanes
alias deuce='screen -x deuce-session'
alias monique='screen -x monique-session'
alias aubrey='screen -x aubrey-session'
alias gam='screen -x gam-session'
alias linda='screen -x linda-session'
alias lanes='screen -ls'
alias spawn-lanes='~/.openclaw/bin/spawn-lanes.sh'
ZRC_EOF
  echo "  ✓ aliases appended to ~/.zshrc"
fi

# 5. Done — instructions for Ak
echo ""
echo "═══ DONE ═══"
echo ""
echo "Next steps on this Mac:"
echo ""
echo "  1. Reload your shell so the aliases work:"
echo "       source ~/.zshrc"
echo "     (or just open a new Terminal window)"
echo ""
echo "  2. Spawn the 5 lanes:"
echo "       spawn-lanes"
echo "     (takes ~30 seconds, prints a checklist)"
echo ""
echo "  3. Open the Claude iOS app → Code tab. The 5 new sessions"
echo "     from this Mac will appear alongside the Mac mini's 5."
echo ""
echo "Optional: to attach to a lane locally on this Mac:"
echo "  deuce      ← attaches to Deuce in the current Terminal"
echo "  Ctrl-A D   ← detach (leaves it running in the background)"
echo ""
