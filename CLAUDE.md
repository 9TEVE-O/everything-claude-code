# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Everything Claude Code (ECC)** is a production-ready AI coding plugin — a collection of agents, skills, hooks, commands, rules, and MCP configurations for Claude Code, Cursor, Codex, and OpenCode.

## Commands

```bash
# Full test suite (CI validators + unit tests)
npm test

# Run individual test files
node tests/run-all.js
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
node tests/hooks/hooks.test.js

# Coverage (80% threshold enforced)
npm run coverage

# Lint (ESLint + markdownlint)
npm run lint

# Audit harness configuration
npm run harness:audit

# ECC CLI (install artifacts into a project)
npx ecc typescript        # installs TypeScript profile
npx ecc --help
```

`npm test` runs these steps in order: validate-agents → validate-commands → validate-rules → validate-skills → validate-hooks → validate-install-manifests → validate-no-personal-paths → catalog → tests/run-all.js. CI failures often come from the validators before the test runner.

## Architecture

### Artifact Types

| Directory | Purpose | Format |
|-----------|---------|--------|
| `agents/` | Subagents for delegation | Markdown + YAML frontmatter |
| `skills/` | Reference knowledge modules (108 dirs, each has `SKILL.md`) | Markdown + YAML frontmatter |
| `commands/` | User-invoked slash commands (57 files) | Markdown with `description` frontmatter |
| `hooks/hooks.json` | Event-driven automations (9,744 lines) | JSON matchers + shell commands |
| `rules/` | Coding standards (layered: `common/` + per-language) | Markdown |
| `scripts/` | Cross-platform Node.js utilities | Node.js (≥18) |
| `mcp-configs/` | MCP server definitions | JSON |

### Cross-Harness Structure

ECC ships to four harnesses. Each has its own directory with a subset of artifacts:
- `.claude/` — Claude Code (primary): settings, learned instincts, project skill
- `.cursor/` — Cursor IDE: `hooks.json`, `hooks/`, `skills/`, `rules/`
- `.codex/` — Codex CLI + app: agent configs in `.agents/skills/`
- `.opencode/` — OpenCode plugin: `commands/`, `plugins/`, `prompts/`, `tools/`

### Rules Layering

Rules are additive. `rules/common/` defines universal standards (coding-style, git-workflow, testing, security, performance, patterns, hooks, agents). Each language directory (`typescript/`, `python/`, `golang/`, `kotlin/`, `cpp/`, `swift/`, `php/`, `perl/`) extends and overrides common rules with the same filenames.

### Hook System

`hooks/hooks.json` defines all automations. Key hook types:
- **PreToolUse** — Can block tool execution (exit code 2). Used for: dev-server guard, tmux reminder, git push confirmation, doc file warnings, compact suggestions.
- **PostToolUse** — Analysis/formatting after tools run: PR logger, build analysis, Prettier format, TypeScript type-check.
- **SessionStart** — Loads prior context from `.claude/homunculus/instincts/`, detects package manager.
- **PreCompact / Stop / SessionEnd** — Persist session state and extract learned patterns.

Hook behavior is controlled at runtime:
```bash
ECC_HOOK_PROFILE=minimal      # Minimal hooks only
ECC_HOOK_PROFILE=standard     # Default
ECC_HOOK_PROFILE=strict       # All hooks enforced
ECC_DISABLED_HOOKS=hook-id1,hook-id2   # Disable specific hooks
ECC_ENABLE_INSAITS=1          # Opt-in security monitor
```

### Agent Model Selection

Agents declare their model in frontmatter. Convention: `haiku` for simple/fast tasks, `sonnet` for coding, `opus` for complex reasoning. The `chief-of-staff` agent orchestrates other agents in parallel.

## File Formats

**Agent** (`agents/*.md`):
```yaml
---
name: agent-name
description: When to invoke this agent
tools: ["Read", "Bash", "Edit"]
model: haiku|sonnet|opus
---
```

**Skill** (`skills/{name}/SKILL.md`):
```yaml
---
name: skill-name
description: Brief description
origin: ECC
---

## When to Activate
## Core Concepts
## Code Examples
## Best Practices
```

**Command** (`commands/*.md`):
```yaml
---
description: Shown in /help
---
```

**Hook** (`hooks/hooks.json`): JSON array of objects with `matcher` (tool name/event pattern) and `hooks` array of `{type, command}`.

## Key Slash Commands

- `/tdd` — Test-driven development workflow
- `/plan` — Implementation planning via planner agent
- `/e2e` — Generate and run E2E tests
- `/code-review` — Quality review
- `/build-fix` — Fix build errors
- `/learn` — Extract patterns from sessions into instincts
- `/skill-create` — Generate skills from git history

## Development Notes

- **Package manager**: Auto-detected (npm, pnpm, yarn, bun). Override via `CLAUDE_PACKAGE_MANAGER` env var or `.claude/package-manager.json`.
- **No shell assumptions**: All hook scripts are Node.js for cross-platform support (Windows, macOS, Linux).
- **No hardcoded paths**: `scripts/ci/validate-no-personal-paths.js` enforces this — CI will fail if personal/absolute paths appear in committed files.
- **File naming**: lowercase with hyphens (e.g., `python-reviewer.md`, `tdd-workflow.md`).
- **Node.js ≥18** required.
