/**
 * Tests for projects/new-thing/decisions.md
 *
 * Run with: node tests/projects/new-thing/decisions.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const repoRoot = path.join(__dirname, '..', '..', '..');
const filePath = path.join(repoRoot, 'projects', 'new-thing', 'decisions.md');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

/**
 * Extract the text of a named decision block (### NNN — ...) up to the next
 * decision heading or end of file.
 */
function extractDecisionBlock(content, decisionId) {
  const headingRegex = new RegExp(`###\\s+${decisionId}\\s+—[^\\n]*\\n`);
  const match = headingRegex.exec(content);
  if (!match) return null;

  const start = match.index;
  // Find the next ### heading after this one, or end of string
  const nextHeading = content.indexOf('\n###', start + 1);
  return nextHeading === -1 ? content.slice(start) : content.slice(start, nextHeading);
}

function runTests() {
  console.log('\n=== Testing projects/new-thing/decisions.md ===\n');

  let passed = 0;
  let failed = 0;

  // --- File existence ---
  console.log('File Existence:');

  if (test('file exists at expected path', () => {
    assert.ok(fs.existsSync(filePath), `File not found: ${filePath}`);
  })) passed++; else failed++;

  // Load content once for subsequent tests
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  // --- H1 heading ---
  console.log('\nHeading:');

  if (test('H1 heading references the project name', () => {
    assert.match(content, /^# Project: new-thing/m, 'Expected H1 heading starting with "# Project: new-thing"');
  })) passed++; else failed++;

  if (test('H1 heading includes "Decisions"', () => {
    assert.match(content, /^# .+Decisions/m, 'Expected H1 heading containing "Decisions"');
  })) passed++; else failed++;

  // --- Decision log section ---
  console.log('\nDecision Log Section:');

  if (test('contains "## Decision log" section', () => {
    assert.ok(content.includes('## Decision log'), '"## Decision log" section missing');
  })) passed++; else failed++;

  // --- Decision 001 ---
  console.log('\nDecision 001:');

  const block001 = extractDecisionBlock(content, '001');

  if (test('decision 001 heading exists', () => {
    assert.ok(block001 !== null, 'Decision 001 heading not found');
  })) passed++; else failed++;

  if (test('decision 001 heading describes mandatory stopping conditions', () => {
    assert.match(
      content,
      /### 001 — Mandatory stopping conditions for all agent loops/,
      'Decision 001 heading text does not match expected description'
    );
  })) passed++; else failed++;

  if (test('decision 001 has Date field', () => {
    assert.ok(block001 && block001.includes('**Date:**'), 'Decision 001 missing Date field');
  })) passed++; else failed++;

  if (test('decision 001 date is 2026-05-14', () => {
    assert.ok(block001 && block001.includes('2026-05-14'), 'Decision 001 date should be 2026-05-14');
  })) passed++; else failed++;

  if (test('decision 001 has Status field', () => {
    assert.ok(block001 && block001.includes('**Status:**'), 'Decision 001 missing Status field');
  })) passed++; else failed++;

  if (test('decision 001 status is Accepted', () => {
    assert.ok(
      block001 && block001.includes('**Status:** Accepted'),
      'Decision 001 status should be Accepted'
    );
  })) passed++; else failed++;

  if (test('decision 001 has Context field', () => {
    assert.ok(block001 && block001.includes('**Context:**'), 'Decision 001 missing Context field');
  })) passed++; else failed++;

  if (test('decision 001 has Decision field', () => {
    assert.ok(block001 && block001.includes('**Decision:**'), 'Decision 001 missing Decision field');
  })) passed++; else failed++;

  if (test('decision 001 has Rationale field', () => {
    assert.ok(block001 && block001.includes('**Rationale:**'), 'Decision 001 missing Rationale field');
  })) passed++; else failed++;

  if (test('decision 001 has Consequences field', () => {
    assert.ok(block001 && block001.includes('**Consequences:**'), 'Decision 001 missing Consequences field');
  })) passed++; else failed++;

  if (test('decision 001 requires explicit stopping condition in task spec', () => {
    assert.ok(
      block001 && block001.includes('stopping condition') && block001.includes('task specification'),
      'Expected requirement for stopping condition in task specification'
    );
  })) passed++; else failed++;

  if (test('decision 001 references learnings/agent-loops-stopping-conditions.md', () => {
    assert.ok(
      block001 && block001.includes('learnings/agent-loops-stopping-conditions.md'),
      'Decision 001 should reference learnings/agent-loops-stopping-conditions.md'
    );
  })) passed++; else failed++;

  if (test('decision 001 consequences mention constraints.md', () => {
    assert.ok(
      block001 && block001.includes('constraints.md'),
      'Decision 001 consequences should reference constraints.md'
    );
  })) passed++; else failed++;

  // --- Decision 002 ---
  console.log('\nDecision 002:');

  const block002 = extractDecisionBlock(content, '002');

  if (test('decision 002 heading exists', () => {
    assert.ok(block002 !== null, 'Decision 002 heading not found');
  })) passed++; else failed++;

  if (test('decision 002 heading describes goal-satisfaction preference', () => {
    assert.match(
      content,
      /### 002 — Prefer goal-satisfaction checks over raw iteration caps/,
      'Decision 002 heading text does not match expected description'
    );
  })) passed++; else failed++;

  if (test('decision 002 has Date field', () => {
    assert.ok(block002 && block002.includes('**Date:**'), 'Decision 002 missing Date field');
  })) passed++; else failed++;

  if (test('decision 002 date is 2026-05-14', () => {
    assert.ok(block002 && block002.includes('2026-05-14'), 'Decision 002 date should be 2026-05-14');
  })) passed++; else failed++;

  if (test('decision 002 has Status field', () => {
    assert.ok(block002 && block002.includes('**Status:**'), 'Decision 002 missing Status field');
  })) passed++; else failed++;

  if (test('decision 002 status is Accepted', () => {
    assert.ok(
      block002 && block002.includes('**Status:** Accepted'),
      'Decision 002 status should be Accepted'
    );
  })) passed++; else failed++;

  if (test('decision 002 has Context field', () => {
    assert.ok(block002 && block002.includes('**Context:**'), 'Decision 002 missing Context field');
  })) passed++; else failed++;

  if (test('decision 002 has Decision field', () => {
    assert.ok(block002 && block002.includes('**Decision:**'), 'Decision 002 missing Decision field');
  })) passed++; else failed++;

  if (test('decision 002 has Rationale field', () => {
    assert.ok(block002 && block002.includes('**Rationale:**'), 'Decision 002 missing Rationale field');
  })) passed++; else failed++;

  if (test('decision 002 has Consequences field', () => {
    assert.ok(block002 && block002.includes('**Consequences:**'), 'Decision 002 missing Consequences field');
  })) passed++; else failed++;

  if (test('decision 002 rationale explains iteration caps produce incomplete results', () => {
    assert.ok(
      block002 && block002.includes('incomplete results'),
      'Decision 002 rationale should explain iteration caps may produce incomplete results'
    );
  })) passed++; else failed++;

  if (test('decision 002 consequences allow combining both styles', () => {
    assert.ok(
      block002 && (block002.includes('goal-check') || block002.includes('goal-satisfaction')) &&
      block002.includes('cap'),
      'Decision 002 consequences should mention combining goal-check with cap as backstop'
    );
  })) passed++; else failed++;

  // --- Cross-file references ---
  console.log('\nCross-File References:');

  if (test('referenced learnings/agent-loops-stopping-conditions.md exists on disk', () => {
    const learningPath = path.join(repoRoot, 'learnings', 'agent-loops-stopping-conditions.md');
    assert.ok(fs.existsSync(learningPath), `Learning file not found: ${learningPath}`);
  })) passed++; else failed++;

  if (test('referenced constraints.md exists on disk', () => {
    const constraintsPath = path.join(repoRoot, 'projects', 'new-thing', 'constraints.md');
    assert.ok(fs.existsSync(constraintsPath), `constraints.md not found: ${constraintsPath}`);
  })) passed++; else failed++;

  // --- Decision log structure ---
  console.log('\nDecision Log Structure:');

  if (test('decisions are numbered sequentially starting at 001', () => {
    assert.ok(content.includes('### 001'), 'Decision 001 not found');
    assert.ok(content.includes('### 002'), 'Decision 002 not found');
  })) passed++; else failed++;

  if (test('decision 001 appears before decision 002 in the file', () => {
    const idx001 = content.indexOf('### 001');
    const idx002 = content.indexOf('### 002');
    assert.ok(idx001 < idx002, 'Decision 001 should precede decision 002');
  })) passed++; else failed++;

  if (test('decisions are separated by a horizontal rule (---)', () => {
    assert.ok(content.includes('\n---\n'), 'Expected horizontal rule separator between decisions');
  })) passed++; else failed++;

  // --- Regression / boundary ---
  console.log('\nRegression / Boundary:');

  if (test('file is non-empty and has meaningful content', () => {
    assert.ok(content.length > 200, 'File content is unexpectedly short');
  })) passed++; else failed++;

  if (test('no decision has an empty Status field', () => {
    const statusMatches = [...content.matchAll(/\*\*Status:\*\*\s*([^\n]+)/g)];
    assert.ok(statusMatches.length > 0, 'No Status fields found');
    for (const m of statusMatches) {
      assert.ok(m[1].trim().length > 0, 'A Status field is empty');
    }
  })) passed++; else failed++;

  if (test('all decisions have a non-empty Date field', () => {
    const dateMatches = [...content.matchAll(/\*\*Date:\*\*\s*([^\n]+)/g)];
    assert.ok(dateMatches.length > 0, 'No Date fields found');
    for (const m of dateMatches) {
      assert.ok(m[1].trim().length > 0, 'A Date field is empty');
    }
  })) passed++; else failed++;

  if (test('decision heading numbers are zero-padded to 3 digits', () => {
    // All decision headings should match ### NNN — ...
    const headingMatches = [...content.matchAll(/^### (\d+)/gm)];
    assert.ok(headingMatches.length > 0, 'No decision headings found');
    for (const m of headingMatches) {
      assert.strictEqual(m[1].length, 3, `Decision number "${m[1]}" should be zero-padded to 3 digits`);
    }
  })) passed++; else failed++;

  console.log(`\nPassed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
