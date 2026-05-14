# Project: new-thing — Decisions

## Decision log

### 001 — Mandatory stopping conditions for all agent loops

**Date:** 2026-05-14  
**Status:** Accepted  
**Context:**
KB search for "ASPRON decisions" returned no prior content. This project
introduces the pattern from scratch based on the learning captured in
`learnings/agent-loops-stopping-conditions.md`.

**Decision:**
Every agent loop in this project must declare a stopping condition
explicitly in the task specification or prompt before the loop runs.

**Rationale:**
- Loops without stopping conditions are the primary driver of runaway costs
  and unexpected side-effects in agentic workflows.
- Explicit conditions make behaviour auditable and reproducible.

**Consequences:**
- New loops require a one-line stopping-condition declaration in code review.
- Existing loops must be audited and retrofitted before the next release.
- The constraint is recorded in `constraints.md`.

---

### 002 — Prefer goal-satisfaction checks over raw iteration caps

**Date:** 2026-05-14  
**Status:** Accepted  
**Context:**
During bootstrapping, two candidate stopping-condition styles were considered:
a hard iteration cap (simple) vs. a goal-satisfaction check (more robust).

**Decision:**
Where the success criterion can be evaluated deterministically, use a
goal-satisfaction check. Fall back to an iteration cap only as a safety net.

**Rationale:**
- Iteration caps stop the loop even when the goal isn't met, producing
  incomplete results silently.
- A goal-satisfaction check makes success explicit and composable.

**Consequences:**
- Agents must expose a checkable success state or return a sentinel value.
- Both styles may be combined: goal-check primary, cap as backstop.
