#!/usr/bin/env bash
set -e

echo "==> Installing ruflo..."
npx ruflo@latest init --wizard

echo "==> Adding ruflo as MCP server for Claude Code..."
claude mcp add ruflo -- npx -y ruflo@latest mcp start

echo "==> Verifying MCP servers..."
claude mcp list

echo "==> Running health check..."
npx ruflo doctor --fix

echo "✅ ruflo MCP setup complete!"
