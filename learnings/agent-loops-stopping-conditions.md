# Learning: Agent loops need stopping conditions

**Source:** KB search for "ASPRON decisions" (no prior content found — this is a net-new insight)
**Date:** 2026-05-14

## The learning

Agent loops must have explicit stopping conditions defined before execution begins.
Without them, loops can run indefinitely, exhaust resources, or produce results
no one intended to act on.

## Why it matters

- An agent that doesn't know when to stop will keep retrying, querying, or
  spawning sub-agents until it hits an external limit (timeout, token cap, API
  quota). That limit is rarely the right stopping point for the task.
- Stopping conditions belong in the prompt / task spec, not in the agent's
  ad-hoc reasoning at runtime.
- Ambiguous loops are the leading cause of runaway costs in agentic workflows.

## Practical patterns

| Pattern | Example |
|---|---|
| Max-iteration cap | "Stop after 5 search-and-refine cycles" |
| Goal-satisfaction check | "Stop when all checklist items are marked done" |
| Confidence threshold | "Stop when diff between iterations is < 2%" |
| External signal | "Stop when CI passes" |
| Explicit sentinel | "Stop when the agent outputs `DONE`" |

## Related ASPRON decisions

KB search returned zero results for "ASPRON decisions" at time of writing.
Decisions will be tracked going forward in `projects/new-thing/decisions.md`.
