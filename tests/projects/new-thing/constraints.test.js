/**
 * Tests for projects/new-thing/constraints.md
 *
 * Run with: node tests/projects/new-thing/constraints.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const repoRoot = path.join(__dirname, '..', '..', '..');
const filePath = path.join(repoRoot, 'projects', 'new-thing', 'constraints.md');

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
  console.log('\n=== Testing projects/new-thing/constraints.md ===\n');

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

  if (test('H1 heading includes "Constraints"', () => {
    assert.match(content, /^# .+Constraints/m, 'Expected H1 heading containing "Constraints"');
  })) passed++; else failed++;

  // --- Required sections ---
  console.log('\nRequired Sections:');

  if (test('contains "## Hard constraints" section', () => {
    assert.ok(content.includes('## Hard constraints'), '"## Hard constraints" section missing');
  })) passed++; else failed++;

  if (test('contains "## Soft constraints" section', () => {
    assert.ok(content.includes('## Soft constraints'), '"## Soft constraints" section missing');
  })) passed++; else failed++;

  if (test('contains "## Out of scope" section', () => {
    assert.ok(content.includes('## Out of scope'), '"## Out of scope" section missing');
  })) passed++; else failed++;

  // --- Hard constraints content ---
  console.log('\nHard Constraints Content:');

  if (test('hard constraints require a stopping condition before execution', () => {
    assert.ok(
      content.includes('stopping condition') && content.includes('before execution'),
      'Expected requirement for stopping condition before execution'
    );
  })) passed++; else failed++;

  if (test('hard constraints forbid unbounded loops', () => {
    assert.ok(
      content.includes('unbounded loops') || content.includes('No unbounded'),
      'Expected prohibition of unbounded loops'
    );
  })) passed++; else failed++;

  if (test('hard constraints list max iterations as valid stopping type', () => {
    assert.ok(
      content.toLowerCase().includes('max iterations'),
      'Expected "max iterations" listed as a valid stopping condition type'
    );
  })) passed++; else failed++;

  if (test('hard constraints list goal-satisfaction check as valid stopping type', () => {
    assert.ok(
      content.toLowerCase().includes('goal-satisfaction check'),
      'Expected "goal-satisfaction check" listed as a valid stopping condition type'
    );
  })) passed++; else failed++;

  if (test('hard constraints list external signal as valid stopping type', () => {
    assert.ok(
      content.toLowerCase().includes('external signal'),
      'Expected "external signal" listed as a valid stopping condition type'
    );
  })) passed++; else failed++;

  if (test('hard constraints list explicit sentinel as valid stopping type', () => {
    assert.ok(
      content.toLowerCase().includes('explicit sentinel'),
      'Expected "explicit sentinel" listed as a valid stopping condition type'
    );
  })) passed++; else failed++;

  if (test('hard constraints require stopping conditions documented in decisions.md before shipping', () => {
    assert.ok(
      content.includes('decisions.md'),
      'Expected requirement to document in decisions.md'
    );
  })) passed++; else failed++;

  // --- Soft constraints content ---
  console.log('\nSoft Constraints Content:');

  if (test('soft constraints prefer goal-satisfaction over raw iteration caps', () => {
    assert.ok(
      content.includes('goal-satisfaction') && content.includes('iteration cap'),
      'Expected preference for goal-satisfaction over iteration caps'
    );
  })) passed++; else failed++;

  if (test('soft constraints recommend keeping logic in prompt/task spec layer', () => {
    assert.ok(
      content.includes('prompt') || content.includes('task spec'),
      'Expected recommendation for prompt/task spec layer'
    );
  })) passed++; else failed++;

  if (test('soft constraints flag loops running more than 3 iterations without result', () => {
    assert.ok(
      content.includes('3 iterations') || content.match(/more than 3/),
      'Expected 3-iteration review threshold'
    );
  })) passed++; else failed++;

  // --- Out of scope content ---
  console.log('\nOut of Scope Content:');

  if (test('out of scope mentions real-time or streaming loops', () => {
    assert.ok(
      content.toLowerCase().includes('real-time') || content.toLowerCase().includes('streaming'),
      'Expected mention of real-time/streaming loops in out-of-scope section'
    );
  })) passed++; else failed++;

  if (test('out of scope clarifies those loops follow a separate pattern', () => {
    assert.ok(
      content.includes('separate pattern'),
      'Expected mention of separate pattern for out-of-scope loops'
    );
  })) passed++; else failed++;

  // --- Cross-references ---
  console.log('\nCross-References:');

  if (test('referenced decisions.md exists on disk', () => {
    const decisionsPath = path.join(repoRoot, 'projects', 'new-thing', 'decisions.md');
    assert.ok(fs.existsSync(decisionsPath), `decisions.md not found: ${decisionsPath}`);
  })) passed++; else failed++;

  // --- Regression / boundary ---
  console.log('\nRegression / Boundary:');

  if (test('hard constraints section appears before soft constraints section', () => {
    const hardIdx = content.indexOf('## Hard constraints');
    const softIdx = content.indexOf('## Soft constraints');
    assert.ok(hardIdx < softIdx, 'Hard constraints should appear before soft constraints');
  })) passed++; else failed++;

  if (test('soft constraints section appears before out-of-scope section', () => {
    const softIdx = content.indexOf('## Soft constraints');
    const outIdx = content.indexOf('## Out of scope');
    assert.ok(softIdx < outIdx, 'Soft constraints should appear before out-of-scope section');
  })) passed++; else failed++;

  if (test('file is non-empty and has meaningful content', () => {
    assert.ok(content.length > 100, 'File content is unexpectedly short');
  })) passed++; else failed++;

  if (test('all four valid stopping-condition types are enumerated in hard constraints', () => {
    const hardSection = content.slice(
      content.indexOf('## Hard constraints'),
      content.indexOf('## Soft constraints')
    );
    const types = ['max iterations', 'goal-satisfaction check', 'external signal', 'explicit sentinel'];
    for (const t of types) {
      assert.ok(
        hardSection.toLowerCase().includes(t),
        `Expected stopping-condition type "${t}" in hard constraints section`
      );
    }
  })) passed++; else failed++;

  console.log(`\nPassed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();