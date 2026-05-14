/**
 * Tests for learnings/agent-loops-stopping-conditions.md
 *
 * Run with: node tests/learnings/agent-loops-stopping-conditions.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const repoRoot = path.join(__dirname, '..', '..');
const filePath = path.join(repoRoot, 'learnings', 'agent-loops-stopping-conditions.md');

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

function runTests() {
  console.log('\n=== Testing learnings/agent-loops-stopping-conditions.md ===\n');

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

  if (test('starts with correct H1 heading', () => {
    assert.ok(
      content.includes('# Learning: Agent loops need stopping conditions'),
      'Expected H1 heading not found'
    );
  })) passed++; else failed++;

  // --- Metadata ---
  console.log('\nMetadata:');

  if (test('contains Source metadata referencing KB search', () => {
    assert.match(content, /\*\*Source:\*\*.*KB search/);
  })) passed++; else failed++;

  if (test('contains Date metadata 2026-05-14', () => {
    assert.ok(content.includes('2026-05-14'), 'Expected date 2026-05-14 not found');
  })) passed++; else failed++;

  // --- Required sections ---
  console.log('\nRequired Sections:');

  if (test('contains "## The learning" section', () => {
    assert.ok(content.includes('## The learning'), '"## The learning" section missing');
  })) passed++; else failed++;

  if (test('contains "## Why it matters" section', () => {
    assert.ok(content.includes('## Why it matters'), '"## Why it matters" section missing');
  })) passed++; else failed++;

  if (test('contains "## Practical patterns" section', () => {
    assert.ok(content.includes('## Practical patterns'), '"## Practical patterns" section missing');
  })) passed++; else failed++;

  if (test('contains "## Related ASPRON decisions" section', () => {
    assert.ok(
      content.includes('## Related ASPRON decisions'),
      '"## Related ASPRON decisions" section missing'
    );
  })) passed++; else failed++;

  // --- Core learning content ---
  console.log('\nCore Learning Content:');

  if (test('"The learning" section describes explicit stopping conditions', () => {
    assert.ok(
      content.includes('explicit stopping conditions'),
      'Expected mention of explicit stopping conditions'
    );
  })) passed++; else failed++;

  if (test('"Why it matters" mentions runaway costs', () => {
    assert.ok(
      content.includes('runaway costs'),
      'Expected mention of runaway costs in "Why it matters"'
    );
  })) passed++; else failed++;

  if (test('"Why it matters" states stopping conditions belong in prompt/task spec', () => {
    assert.ok(
      content.includes('prompt') && content.includes('task spec'),
      'Expected mention of prompt/task spec layer'
    );
  })) passed++; else failed++;

  // --- Practical patterns table ---
  console.log('\nPractical Patterns Table:');

  if (test('table has Pattern and Example column headers', () => {
    assert.match(content, /\|\s*Pattern\s*\|\s*Example\s*\|/);
  })) passed++; else failed++;

  if (test('table contains Max-iteration cap pattern', () => {
    assert.ok(content.includes('Max-iteration cap'), 'Max-iteration cap pattern missing from table');
  })) passed++; else failed++;

  if (test('table contains Goal-satisfaction check pattern', () => {
    assert.ok(
      content.includes('Goal-satisfaction check'),
      'Goal-satisfaction check pattern missing from table'
    );
  })) passed++; else failed++;

  if (test('table contains Confidence threshold pattern', () => {
    assert.ok(
      content.includes('Confidence threshold'),
      'Confidence threshold pattern missing from table'
    );
  })) passed++; else failed++;

  if (test('table contains External signal pattern', () => {
    assert.ok(content.includes('External signal'), 'External signal pattern missing from table');
  })) passed++; else failed++;

  if (test('table contains Explicit sentinel pattern', () => {
    assert.ok(
      content.includes('Explicit sentinel'),
      'Explicit sentinel pattern missing from table'
    );
  })) passed++; else failed++;

  if (test('table has at least 5 pattern rows (excluding header)', () => {
    // Count table rows: lines matching | ... | ... |
    const tableRows = content
      .split('\n')
      .filter(line => /^\|.+\|.+\|/.test(line.trim()))
      .filter(line => !/^[\s|:-]+$/.test(line.trim())); // exclude separator rows
    assert.ok(tableRows.length >= 6, `Expected at least 6 table rows (header + 5 patterns), got ${tableRows.length}`);
  })) passed++; else failed++;

  // --- Cross-references ---
  console.log('\nCross-References:');

  if (test('references projects/new-thing/decisions.md', () => {
    assert.ok(
      content.includes('projects/new-thing/decisions.md'),
      'Expected reference to projects/new-thing/decisions.md'
    );
  })) passed++; else failed++;

  if (test('referenced projects/new-thing/decisions.md exists on disk', () => {
    const referencedPath = path.join(repoRoot, 'projects', 'new-thing', 'decisions.md');
    assert.ok(fs.existsSync(referencedPath), `Cross-referenced file not found: ${referencedPath}`);
  })) passed++; else failed++;

  // --- Regression / boundary ---
  console.log('\nRegression / Boundary:');

  if (test('does not suggest loops can run without any stopping condition', () => {
    // The file should not contain misleading advice that loops are fine without stopping conditions
    assert.ok(
      !content.match(/loops? (can|may|should) run without (a |any )?stopping condition/i),
      'File unexpectedly suggests loops without stopping conditions are acceptable'
    );
  })) passed++; else failed++;

  if (test('file is non-empty and has meaningful content', () => {
    assert.ok(content.length > 200, 'File content is unexpectedly short');
  })) passed++; else failed++;

  if (test('all four stopping-condition types mentioned in the file', () => {
    const types = ['max', 'goal', 'signal', 'sentinel'];
    for (const t of types) {
      assert.ok(
        content.toLowerCase().includes(t),
        `Expected stopping-condition type keyword "${t}" not found`
      );
    }
  })) passed++; else failed++;

  console.log(`\nPassed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();