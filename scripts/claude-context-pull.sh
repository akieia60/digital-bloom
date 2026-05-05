#!/bin/bash
# claude-context-pull.sh
# ─────────────────────────────────────────────────────────────────
# Install Ak's Claude Code context (auto-memory + subagents +
# settings) on this Mac from the iCloud-shared bundle written by
# the Mac mini.
#
# What gets installed:
#   ~/.claude/projects/<this-mac-slug>/memory/   ← 75+ memory files
#   ~/.claude/agents/                            ← custom subagents
#   ~/.claude/settings.json                      ← YOLO + theme + hooks
#   ~/.claude/settings.local.json (if present)
#
# The "<this-mac-slug>" is computed from $HOME by replacing /
# with -, so on the MacBook Pro it becomes -Users-akieiamoniquedavis.
#
# Idempotent — safe to re-run any time the Mac mini pushes a fresh
# bundle (the source of truth is always the Mac mini's bundle in
# iCloud Drive at digitalbloom/claude-shared/).
#
# Usage on the new Mac:
#   bash ~/Documents/GitHub/digital-bloom/scripts/claude-context-pull.sh
# ─────────────────────────────────────────────────────────────────

set -u

ICLOUD="$HOME/Library/Mobile Documents/com~apple~CloudDocs/digitalbloom/claude-shared"
CLAUDE_DIR="$HOME/.claude"

echo "═══ Claude context pull — $(scutil --get ComputerName 2>/dev/null || hostname) ═══"
echo ""

if [ ! -d "$ICLOUD" ]; then
  echo "✗ Bundle not found at:"
  echo "  $ICLOUD"
  echo ""
  echo "Make sure iCloud Drive has finished syncing on this Mac."
  echo "Open Finder → iCloud Drive → digitalbloom/claude-shared/ and"
  echo "wait for the cloud-download icons to clear if you see them."
  exit 1
fi

echo "→ Found bundle:"
echo "  $ICLOUD"
echo ""

# Build the per-Mac project slug from $HOME (e.g., /Users/ak → -Users-ak)
SLUG=$(echo "$HOME" | sed 's|/|-|g')
PROJECT_DIR="$CLAUDE_DIR/projects/$SLUG"
MEMORY_DIR="$PROJECT_DIR/memory"

echo "→ Installing memory to $MEMORY_DIR ..."
mkdir -p "$MEMORY_DIR"
rsync -a --delete "$ICLOUD/memory/" "$MEMORY_DIR/"
COUNT=$(ls "$MEMORY_DIR" | wc -l | tr -d ' ')
echo "  ✓ $COUNT memory files installed"

echo ""
echo "→ Installing subagents to $CLAUDE_DIR/agents/ ..."
mkdir -p "$CLAUDE_DIR/agents"
rsync -a "$ICLOUD/agents/" "$CLAUDE_DIR/agents/"
AGENT_COUNT=$(ls "$CLAUDE_DIR/agents" 2>/dev/null | wc -l | tr -d ' ')
echo "  ✓ $AGENT_COUNT agents installed"

echo ""
echo "→ Installing settings ..."
if [ -f "$ICLOUD/settings.json" ]; then
  cp -f "$ICLOUD/settings.json" "$CLAUDE_DIR/settings.json"
  echo "  ✓ settings.json"
fi
if [ -f "$ICLOUD/settings.local.json" ]; then
  cp -f "$ICLOUD/settings.local.json" "$CLAUDE_DIR/settings.local.json"
  echo "  ✓ settings.local.json"
fi

echo ""
echo "═══ DONE ═══"
echo ""
echo "Your MacBook Pro now has the same brain as the Mac mini:"
echo "  • 75+ memory entries (who you are, how you work, the lane system,"
echo "    Mother's Day priority, the Digital Bloom infrastructure)"
echo "  • $AGENT_COUNT custom subagents (aubrey, seedance-master,"
echo "    digital-bloom-inventory, ground-control-status, video-publisher)"
echo "  • YOLO default mode + theme + hooks"
echo ""
echo "Next: kill and re-spawn the lanes so they pick up the new context:"
echo ""
echo "    spawn-lanes"
echo ""
echo "Each fresh lane will read the auto-memory on first message and know"
echo "who you are, how you like to work, and what we've built together."
