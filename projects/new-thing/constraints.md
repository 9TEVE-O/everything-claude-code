# Project: new-thing — Constraints

## Hard constraints

- All agent loops must declare a stopping condition before execution.
- No unbounded loops: every iterative process must have at least one of
  (max iterations, goal-satisfaction check, external signal, or explicit sentinel).
- Stopping conditions must be documented in this project's `decisions.md`
  before the relevant code ships.

## Soft constraints

- Prefer goal-satisfaction checks over raw iteration caps where the success
  criterion can be evaluated deterministically.
- Keep stopping-condition logic in the prompt / task spec layer, not buried
  inside tool implementations.
- Review any agent loop that ran more than 3 iterations without producing a
  result — treat it as a signal that the stopping condition was under-specified.

## Out of scope

- Real-time / streaming loops that are externally terminated (e.g., a
  live-feed consumer) — those follow a separate pattern not covered here.
