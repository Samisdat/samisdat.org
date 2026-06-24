#!/usr/bin/env bash
#
# Toggle the project-wide "chrome-devtools" MCP server on/off.
# The server is DEFINED in .mcp.json and DEFAULTS TO OFF. This script flips
# its activation in .claude/settings.local.json (per-user, not committed).
#
# Usage:
#   .claude/chrome-mcp.sh on       # enable  -> restart Claude Code (or /mcp reconnect)
#   .claude/chrome-mcp.sh off      # disable -> restart Claude Code
#   .claude/chrome-mcp.sh status   # show current state
#
# After on/off, restart Claude Code so it (re)loads the MCP server.

set -euo pipefail

NAME="chrome-devtools"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETTINGS="$DIR/settings.local.json"
ACTION="${1:-status}"

node - "$SETTINGS" "$NAME" "$ACTION" <<'NODE'
const fs = require('fs');
const [, , file, name, action] = process.argv;

const cfg = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
cfg.enabledMcpjsonServers = cfg.enabledMcpjsonServers || [];
cfg.disabledMcpjsonServers = cfg.disabledMcpjsonServers || [];

const has = (a) => a.includes(name);
const drop = (a) => a.filter((x) => x !== name);

if (action === 'on') {
  cfg.disabledMcpjsonServers = drop(cfg.disabledMcpjsonServers);
  if (!has(cfg.enabledMcpjsonServers)) cfg.enabledMcpjsonServers.push(name);
  fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`✅ ${name} enabled — restart Claude Code (or run /mcp) to load it.`);
} else if (action === 'off') {
  cfg.enabledMcpjsonServers = drop(cfg.enabledMcpjsonServers);
  if (!has(cfg.disabledMcpjsonServers)) cfg.disabledMcpjsonServers.push(name);
  fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`🛑 ${name} disabled — restart Claude Code to unload it.`);
} else if (action === 'status') {
  const state = has(cfg.enabledMcpjsonServers)
    ? 'ON'
    : has(cfg.disabledMcpjsonServers)
      ? 'OFF'
      : 'OFF (not approved)';
  console.log(`${name}: ${state}`);
} else {
  console.error(`Unknown action "${action}". Use: on | off | status`);
  process.exit(1);
}
NODE
