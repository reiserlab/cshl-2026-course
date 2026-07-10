#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const patternsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(patternsDir);
const bundleDir = patternsDir;
const manifestPath = path.join(patternsDir, 'shared_pattern_library_manifest.md');

const entries = [
  ['p100_dim', 'patterns/p100_rig_test/001_p100_dim.pat'],
  ['p100_bright', 'patterns/p100_rig_test/002_p100_bright.pat'],
  ['p100_panel_map', 'patterns/p100_rig_test/003_p100_panel_map.pat'],
  ['p100_slow_bar', 'patterns/p100_rig_test/004_p100_slow_bar.pat'],
  ['course_grating_36deg', 'patterns/p0/001_p0_grating_36deg.pat'],
  ['p0_bar10_dark', 'patterns/p0/002_p0_bar10_dark.pat'],
  ['p1v2_loom_disc_f', 'patterns/p1_motion/001_p1v2_loom_disc_f.pat'],
  ['p1v2_loom_disc_l45', 'patterns/p1_motion/002_p1v2_loom_disc_l45.pat'],
  ['p1v2_loom_disc_r45', 'patterns/p1_motion/003_p1v2_loom_disc_r45.pat'],
  ['p1v2_loom_disc_l90', 'patterns/p1_motion/004_p1v2_loom_disc_l90.pat'],
  ['p1v2_loom_disc_r90', 'patterns/p1_motion/005_p1v2_loom_disc_r90.pat'],
  ['p1v2_loom_ann_f', 'patterns/p1_motion/006_p1v2_loom_ann_f.pat'],
  ['p1v2_loom_ann_l45', 'patterns/p1_motion/007_p1v2_loom_ann_l45.pat'],
  ['p1v2_loom_ann_r45', 'patterns/p1_motion/008_p1v2_loom_ann_r45.pat'],
  ['p1v2_loom_ann_l90', 'patterns/p1_motion/009_p1v2_loom_ann_l90.pat'],
  ['p1v2_loom_ann_r90', 'patterns/p1_motion/010_p1v2_loom_ann_r90.pat'],
  ['p1v2_loom_dots_f', 'patterns/p1_motion/011_p1v2_loom_dots_f.pat'],
  ['p1v2_loom_dots_l45', 'patterns/p1_motion/012_p1v2_loom_dots_l45.pat'],
  ['p1v2_loom_dots_r45', 'patterns/p1_motion/013_p1v2_loom_dots_r45.pat'],
  ['p1v2_loom_dots_l90', 'patterns/p1_motion/014_p1v2_loom_dots_l90.pat'],
  ['p1v2_loom_dots_r90', 'patterns/p1_motion/015_p1v2_loom_dots_r90.pat'],
  ['p1v2_grating_72deg', 'patterns/p1_motion/017_p1v2_grating_72deg.pat'],
  ['course_bg', 'patterns/p1_motion/018_p1v2_bg.pat'],
  ['p2_bar', 'patterns/p2_object/001_p2_bar.pat'],
  ['p2_ab_small_l', 'patterns/p2_object/003_p2_ab_small_l.pat'],
  ['p2_ab_small_r', 'patterns/p2_object/004_p2_ab_small_r.pat'],
  ['p2_ab_bpole_l', 'patterns/p2_object/005_p2_ab_bpole_l.pat'],
  ['p2_ab_bpole_r', 'patterns/p2_object/006_p2_ab_bpole_r.pat'],
  ['p2_ab_bright_l', 'patterns/p2_object/007_p2_ab_bright_l.pat'],
  ['p2_ab_bright_r', 'patterns/p2_object/008_p2_ab_bright_r.pat'],
  ['p2_ab_dark', 'patterns/p2_object/009_p2_ab_dark_l.pat'],
  ['p2_ab_edge_l', 'patterns/p2_object/011_p2_ab_edge_l.pat'],
  ['p2_ab_edge_r', 'patterns/p2_object/012_p2_ab_edge_r.pat'],
  ['p2_ab_peak_l', 'patterns/p2_object/013_p2_ab_peak_l.pat'],
  ['p2_ab_peak_r', 'patterns/p2_object/014_p2_ab_peak_r.pat'],
  ['p3_heisenberg_ts', 'patterns/p3_conditioning/001_p3_heisenberg_ts.pat'],
  ['p3_heisenberg_high_low', 'patterns/p3_conditioning/002_p3_heisenberg_high_low.pat'],
  ['p3_heisenberg_slashes', 'patterns/p3_conditioning/003_p3_heisenberg_slashes.pat'],
  ['p3_heisenberg_relational', 'patterns/p3_conditioning/004_p3_heisenberg_relational.pat'],
  ['p3_dill_random_checkers', 'patterns/p3_conditioning/005_p3_dill_random_checkers.pat']
].map(([name, source], index) => ({ id: index + 1, name, source }));

const aliases = new Map([
  ['p0_grating_36deg', 'course_grating_36deg'],
  ['p1v2_grating_36deg', 'course_grating_36deg'],
  ['p1v2_bg', 'course_bg'],
  ['p2_bg', 'course_bg'],
  ['p2_ab_dark_l', 'p2_ab_dark'],
  ['p2_ab_dark_r', 'p2_ab_dark']
]);

const duplicateGroups = [
  {
    canonical: 'course_grating_36deg',
    sources: [
      'patterns/p0/001_p0_grating_36deg.pat',
      'patterns/p1_motion/016_p1v2_grating_36deg.pat'
    ]
  },
  {
    canonical: 'course_bg',
    sources: [
      'patterns/p1_motion/018_p1v2_bg.pat',
      'patterns/p2_object/002_p2_bg.pat'
    ]
  },
  {
    canonical: 'p2_ab_dark',
    sources: [
      'patterns/p2_object/009_p2_ab_dark_l.pat',
      'patterns/p2_object/010_p2_ab_dark_r.pat'
    ]
  }
];

const yamlFiles = [
  'protocols/shared/p100_rig_test.yaml',
  'protocols/shared/p0_opto_intensity_short.yaml',
  'protocols/shared/p0_opto_intensity_full.yaml',
  'protocols/shared/p1_motion_v2_short.yaml',
  'protocols/shared/p1_motion_v2_full.yaml',
  'protocols/shared/p2_object_tonic_short.yaml',
  'protocols/shared/p2_object_tonic_full.yaml',
  'protocols/shared/p2_object_burst_short.yaml',
  'protocols/shared/p2_object_burst_full.yaml'
];

const byName = new Map(entries.map((entry) => [entry.name, entry]));

function fail(message) {
  throw new Error(message);
}

function absolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

function digest(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function bundleFile(entry) {
  return `${String(entry.id).padStart(3, '0')}_${entry.name}.pat`;
}

function canonicalName(name) {
  return aliases.get(name) ?? name;
}

function verifySources() {
  if (entries.length !== 40) fail(`Expected 40 entries, found ${entries.length}`);

  const hashes = new Set();
  for (const entry of entries) {
    const sourcePath = absolute(entry.source);
    if (!fs.existsSync(sourcePath)) fail(`Missing source: ${entry.source}`);
    const hash = digest(sourcePath);
    if (hashes.has(hash)) fail(`Bundle entries are not unique at ${entry.source}`);
    hashes.add(hash);
  }

  for (const group of duplicateGroups) {
    const hashesInGroup = new Set(group.sources.map((source) => digest(absolute(source))));
    if (hashesInGroup.size !== 1) {
      fail(`Expected byte-identical aliases for ${group.canonical}`);
    }
    const canonicalHash = digest(absolute(byName.get(group.canonical).source));
    if (!hashesInGroup.has(canonicalHash)) {
      fail(`Canonical source does not match aliases for ${group.canonical}`);
    }
  }
}

function writeBundle() {
  fs.mkdirSync(bundleDir, { recursive: true });
  const expected = new Set(entries.map(bundleFile));
  for (const fileName of fs.readdirSync(bundleDir)) {
    if (fileName.endsWith('.pat') && !expected.has(fileName)) {
      fs.unlinkSync(path.join(bundleDir, fileName));
    }
  }
  for (const entry of entries) {
    fs.copyFileSync(absolute(entry.source), path.join(bundleDir, bundleFile(entry)));
  }
}

function rewriteYaml(relativePath) {
  const filePath = absolute(relativePath);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let pending = null;
  let pairCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const patternMatch = lines[index].match(/^(\s*)pattern:\s*["']?([^"'\s#]+)["']?\s*$/);
    if (patternMatch) {
      if (pending) fail(`${relativePath}:${index + 1}: pattern without pattern_ID`);
      const name = canonicalName(patternMatch[2]);
      if (!byName.has(name)) fail(`${relativePath}:${index + 1}: unknown pattern ${name}`);
      lines[index] = `${patternMatch[1]}pattern: "${name}"`;
      pending = { name, line: index + 1 };
      continue;
    }

    const idMatch = lines[index].match(/^(\s*)pattern_ID:\s*\d+\s*$/);
    if (idMatch && pending) {
      lines[index] = `${idMatch[1]}pattern_ID: ${byName.get(pending.name).id}`;
      pairCount += 1;
      pending = null;
    }
  }

  if (pending) fail(`${relativePath}:${pending.line}: pattern without pattern_ID`);
  if (pairCount === 0) fail(`${relativePath}: no pattern/pattern_ID pairs found`);
  fs.writeFileSync(filePath, lines.join('\n'));
}

function referencedPatternNames(relativePath) {
  const text = fs.readFileSync(absolute(relativePath), 'utf8');
  const names = new Set();
  for (const match of text.matchAll(/^\s*pattern:\s*["']?([^"'\s#]+)["']?\s*$/gm)) {
    if (!byName.has(match[1])) fail(`${relativePath}: noncanonical pattern ${match[1]}`);
    names.add(match[1]);
  }
  if (names.size === 0) fail(`${relativePath}: no referenced patterns found`);
  return [...names].sort((a, b) => byName.get(a).id - byName.get(b).id);
}

function protocolPatternDir(relativePath) {
  const parsed = path.parse(absolute(relativePath));
  return path.join(parsed.dir, `${parsed.name}_patterns`);
}

function syncProtocolPatternFolders() {
  for (const yamlFile of yamlFiles) {
    const targetDir = protocolPatternDir(yamlFile);
    fs.mkdirSync(targetDir, { recursive: true });
    const names = referencedPatternNames(yamlFile);
    const expected = new Set(names.map((name) => bundleFile(byName.get(name))));
    for (const fileName of fs.readdirSync(targetDir)) {
      if (fileName.endsWith('.pat') && !expected.has(fileName)) {
        fs.unlinkSync(path.join(targetDir, fileName));
      }
    }
    for (const name of names) {
      const entry = byName.get(name);
      const fileName = bundleFile(entry);
      fs.copyFileSync(path.join(bundleDir, fileName), path.join(targetDir, fileName));
    }
  }
}

function manifestText() {
  const legacyByCanonical = new Map(entries.map((entry) => [entry.name, []]));
  for (const [legacy, canonical] of aliases) legacyByCanonical.get(canonical).push(legacy);

  const rows = entries.map((entry) => {
    const legacy = legacyByCanonical.get(entry.name);
    return `| ${entry.id} | \`${bundleFile(entry)}\` | \`${entry.name}\` | ${legacy.length ? legacy.map((name) => `\`${name}\``).join(', ') : '—'} | \`${entry.source}\` |`;
  });

  return `# CSHL 2026 unified SD pattern bundle

Copy the **40 \`.pat\` files directly under \`patterns/\`** (the shared
pattern library) to the root of the controller SD card. Do not copy the source
subdirectories or mix these files with per-protocol pattern folders.

The three duplicate pairs found in the P0–P3 plus P100 source sets are stored
once under shared canonical names. Maintained shared protocol YAMLs use the
canonical name and the global 1-based SD index below. P3 patterns occupy IDs
36–40; a released P3 protocol YAML does not yet exist.

Each maintained protocol's sibling \`*_patterns\` folder is a sparse subset
using these same global filenames. Those sparse folders support editing and
promotion, but they are not standalone SD-card bundles: use the flat .pat
files directly under \`patterns/\` for the controller card.

This manifest and bundle are generated by
\`node patterns/build_course_sd_bundle.mjs --write\`. Run the same command with
\`--check\` to verify source hashes, bundle contents, and all shared YAML
name/ID pairs.

| ID | SD filename | Canonical pattern name | Replaces legacy alias(es) | Source |
| ---: | --- | --- | --- | --- |
${rows.join('\n')}
`;
}

function verifyBundle() {
  const files = fs.readdirSync(bundleDir).filter((name) => name.endsWith('.pat')).sort();
  const expected = entries.map(bundleFile);
  if (files.length !== 40) fail(`Expected 40 bundled .pat files, found ${files.length}`);
  if (JSON.stringify(files) !== JSON.stringify(expected)) {
    fail('Bundle filenames do not match the global alphabetical order');
  }
  const hashes = new Set();
  for (const entry of entries) {
    const outputPath = path.join(bundleDir, bundleFile(entry));
    if (digest(outputPath) !== digest(absolute(entry.source))) {
      fail(`Bundled bytes differ from source for ${entry.name}`);
    }
    hashes.add(digest(outputPath));
  }
  if (hashes.size !== 40) fail(`Expected 40 unique output hashes, found ${hashes.size}`);
}

function verifyProtocolPatternFolder(relativePath) {
  const targetDir = protocolPatternDir(relativePath);
  const names = referencedPatternNames(relativePath);
  const expected = names.map((name) => bundleFile(byName.get(name))).sort();
  const actual = fs.readdirSync(targetDir).filter((name) => name.endsWith('.pat')).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${relativePath}: sibling pattern folder does not match YAML references`);
  }
  for (const name of names) {
    const fileName = bundleFile(byName.get(name));
    if (digest(path.join(targetDir, fileName)) !== digest(path.join(bundleDir, fileName))) {
      fail(`${relativePath}: sibling bytes differ for ${name}`);
    }
  }
}

function verifyYaml(relativePath) {
  const lines = fs.readFileSync(absolute(relativePath), 'utf8').split('\n');
  let pending = null;
  let pairCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const patternMatch = lines[index].match(/^\s*pattern:\s*["']?([^"'\s#]+)["']?\s*$/);
    if (patternMatch) {
      if (pending) fail(`${relativePath}:${index + 1}: pattern without pattern_ID`);
      const name = patternMatch[1];
      if (!byName.has(name)) fail(`${relativePath}:${index + 1}: noncanonical pattern ${name}`);
      pending = { name, line: index + 1 };
      continue;
    }
    const idMatch = lines[index].match(/^\s*pattern_ID:\s*(\d+)\s*$/);
    if (idMatch && pending) {
      const expectedId = byName.get(pending.name).id;
      if (Number(idMatch[1]) !== expectedId) {
        fail(`${relativePath}:${index + 1}: ${pending.name} uses ${idMatch[1]}, expected ${expectedId}`);
      }
      pairCount += 1;
      pending = null;
    }
  }

  if (pending) fail(`${relativePath}:${pending.line}: pattern without pattern_ID`);
  if (pairCount === 0) fail(`${relativePath}: no pattern/pattern_ID pairs found`);
  return pairCount;
}

function main() {
  const mode = process.argv[2];
  if (!['--write', '--check'].includes(mode)) {
    fail('Usage: node patterns/build_course_sd_bundle.mjs --write|--check');
  }

  verifySources();
  if (mode === '--write') {
    writeBundle();
    for (const yamlFile of yamlFiles) rewriteYaml(yamlFile);
    syncProtocolPatternFolders();
    fs.writeFileSync(manifestPath, manifestText());
  }

  verifyBundle();
  let pairCount = 0;
  for (const yamlFile of yamlFiles) {
    pairCount += verifyYaml(yamlFile);
    verifyProtocolPatternFolder(yamlFile);
  }
  console.log(`Validated 40 unique SD patterns and ${pairCount} YAML pattern/ID pairs.`);
}

main();
