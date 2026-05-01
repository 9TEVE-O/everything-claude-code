# ruflo MCP Setup

## What is ruflo?

[ruflo](https://ruflo.dev) is a workflow automation tool that can be driven directly by Claude Code via the Model Context Protocol (MCP). By registering ruflo as an MCP server, Claude Code gains the ability to trigger, inspect, and manage ruflo workflows as part of any coding session — without leaving the chat interface.

## Setup Steps

The setup script (`scripts/setup-ruflo.sh`) performs four steps:

### 1. Install ruflo

```bash
npx ruflo@latest init --wizard
```

Runs the interactive wizard to initialise ruflo in the current project. Follow the prompts to configure your workflow directory and any integrations you need.

### 2. Add ruflo as an MCP Server for Claude Code

```bash
claude mcp add ruflo -- npx -y ruflo@latest mcp start
```

Registers ruflo with Claude Code's MCP layer. After this step Claude Code can call ruflo tools directly in any session that runs in this environment.

### 3. Verify MCP Servers

```bash
claude mcp list
```

Prints all registered MCP servers. Confirm `ruflo` appears in the list before proceeding.

### 4. Health Check

```bash
npx ruflo doctor --fix
```

Runs ruflo's built-in diagnostic tool and automatically resolves common configuration issues.

## Running the Script

```bash
bash scripts/setup-ruflo.sh
```

Re-run at any time to repair or re-register the MCP server (e.g. after a `claude` CLI upgrade or a fresh clone).

## How the MCP Server Works

Once registered, Claude Code can invoke ruflo tools natively inside a session. This means you can ask Claude to:

- List available ruflo workflows
- Trigger a specific workflow by name
- Inspect workflow run history and logs
- Chain ruflo automation steps alongside code edits

No manual context-switching or terminal juggling required — Claude Code drives ruflo directly through the MCP interface.
