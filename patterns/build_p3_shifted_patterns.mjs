#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const patternsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(patternsDir);
const sourceDir = path.join(patternsDir, 'p3_conditioning');
const shiftFrames = 50;

const pairs = [
  ['001_p3_heisenberg_ts.pat', '006_p3_heisenberg_ts_shift90.pat'],
  ['002_p3_heisenberg_high_low.pat', '007_p3_heisenberg_high_low_shift90.pat'],
  ['003_p3_heisenberg_slashes.pat', '008_p3_heisenberg_slashes_shift90.pat'],
  ['004_p3_heisenberg_relational.pat', '009_p3_heisenberg_relational_shift90.pat'],
  ['005_p3_dill_random_checkers.pat', '010_p3_dill_random_checkers_shift90.pat']
];

const toolRoots = [
  process.env.WEBDISPLAYTOOLS_DIR,
  path.resolve(repoRoot, '..', 'webDisplayTools'),
  '/Users/reiserm/Documents/GitHub/webDisplayTools'
].filter(Boolean);
const toolsRoot = toolRoots.find((root) =>
  fs.existsSync(path.join(root, 'js', 'pat-parser.js')) &&
  fs.existsSync(path.join(root, 'js', 'pat-encoder.js'))
);
if (!toolsRoot) {
  throw new Error('Cannot locate webDisplayTools; set WEBDISPLAYTOOLS_DIR.');
}

const parserModule = require(path.join(toolsRoot, 'js', 'pat-parser.js'));
const PatParser = parserModule.default || parserModule;
const PatEncoder = require(path.join(toolsRoot, 'js', 'pat-encoder.js'));

function parseStrict(filePath) {
  const bytes = fs.readFileSync(filePath);
  return PatParser.parsePatFile(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    { strict: true }
  );
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function shiftedPattern(source) {
  assert(source.numFrames === 200, 'P3 source must have 200 frames');
  return {
    generation: source.generation,
    gs_val: source.gs_val,
    numFrames: source.numFrames,
    rowCount: source.rowCount,
    colCount: source.colCount,
    pixelRows: source.pixelRows,
    pixelCols: source.pixelCols,
    frames: source.frames.map((_, index) => source.frames[(index + shiftFrames) % source.numFrames]),
    stretchValues: source.stretchValues.map((_, index) =>
      source.stretchValues[(index + shiftFrames) % source.numFrames]
    ),
    arena_id: source.arena_id,
    observer_id: source.observer_id
  };
}

function verifyPair(sourcePath, shiftedPath) {
  const source = parseStrict(sourcePath);
  const shifted = parseStrict(shiftedPath);
  assert(shifted.numFrames === source.numFrames, `${shiftedPath}: frame count differs`);
  assert(shifted.generation === 'G6', `${shiftedPath}: expected G6`);
  for (let index = 0; index < source.numFrames; index += 1) {
    const expected = source.frames[(index + shiftFrames) % source.numFrames];
    assert(
      Buffer.compare(Buffer.from(shifted.frames[index]), Buffer.from(expected)) === 0,
      `${shiftedPath}: frame ${index} is not source frame ${(index + shiftFrames) % source.numFrames}`
    );
  }
}

function main() {
  const mode = process.argv[2];
  if (!['--write', '--check'].includes(mode)) {
    throw new Error('Usage: node patterns/build_p3_shifted_patterns.mjs --write|--check');
  }

  for (const [sourceName, shiftedName] of pairs) {
    const sourcePath = path.join(sourceDir, sourceName);
    const shiftedPath = path.join(sourceDir, shiftedName);
    if (mode === '--write') {
      const encoded = PatEncoder.encode(shiftedPattern(parseStrict(sourcePath)));
      fs.writeFileSync(shiftedPath, Buffer.from(new Uint8Array(encoded)));
    }
    assert(fs.existsSync(shiftedPath), `Missing shifted pattern: ${shiftedName}`);
    verifyPair(sourcePath, shiftedPath);
    console.log(`${shiftedName}: exact +${shiftFrames}-frame phase shift`);
  }
}

main();
