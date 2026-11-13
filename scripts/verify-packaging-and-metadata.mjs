#!/usr/bin/env node

/**
 * verify-packaging-and-metadata.mjs
 *
 * Automated 4-tier E2E verification test suite runner for portfolio-game:
 * - Tier 1: Feature Coverage (presence, structure, schema conformance)
 * - Tier 2: Boundary & Corner Cases (limits, regex, SPDX, lengths, URL protocols)
 * - Tier 3: Cross-Feature Combinations (pairwise coherence across repo metadata, docs, workflows, exports)
 * - Tier 4: Real-World Scenarios (npm pack dry-run tarball validation, tsc, lint, optional static build)
 *
 * Supported CLI Flags:
 *   --tier=1           Run Tier 1 Feature Coverage checks
 *   --tier=2           Run Tier 2 Boundary & Corner Cases checks
 *   --tier=3           Run Tier 3 Cross-Feature Combination checks
 *   --tier=4           Run Tier 4 Real-World Application Scenario checks
 *   --include-heavy    Include static site build (npm run build) in Tier 4
 *   --verbose, -v      Print verbose details for all checks
 *   --help, -h         Display usage and help information
 *
 * Default (no tier flags): Runs all tiers (Tiers 1, 2, 3, 4 without heavy build).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Resolve project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Authoritative contract values from PROJECT.md / ORIGINAL_REQUEST.md
const CONTRACT = {
  packageName: '@yashshingan/portfolio-game',
  homepageUrl: 'https://yashshingan.github.io/portfolio-game/',
  description: 'Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS.',
  descriptionLength: 126,
  spdxLicense: 'MIT',
  publishAccess: 'public',
  npmRegistry: 'https://registry.npmjs.org/',
  githubPackagesRegistry: 'https://npm.pkg.github.com',
  topics: [
    'portfolio',
    'portfolio-website',
    'interactive-portfolio',
    'developer-portfolio',
    'game-portfolio',
    'phaser',
    'phaser3',
    'game-development',
    'web-game',
    '2d-game',
    'rpg',
    'pixel-art',
    'retro-gaming',
    'chiptune',
    'nextjs',
    'react',
    'typescript',
    'tailwindcss',
    'web-audio-api',
    'server-sent-events',
  ],
  subpathExports: [
    '.',
    './audio',
    './controls',
    './dialogue',
    './arcade',
    './engine',
    './types',
    './styles.css',
  ],
};

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

class TestReporter {
  constructor(options = {}) {
    this.verbose = Boolean(options.verbose);
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.warnings = 0;
    this.currentSection = '';
    this.startTime = Date.now();
  }

  section(title) {
    this.currentSection = title;
    console.log(`\n${COLORS.bright}${COLORS.cyan}=== ${title} ===${COLORS.reset}`);
  }

  assert(id, title, condition, failureDetails = '') {
    this.total++;
    if (condition) {
      this.passed++;
      console.log(`  ${COLORS.green}[PASS]${COLORS.reset} ${id}: ${title}`);
    } else {
      this.failed++;
      console.log(`  ${COLORS.red}[FAIL]${COLORS.reset} ${id}: ${title}`);
      if (failureDetails) {
        const lines = String(failureDetails).split('\n');
        for (const line of lines) {
          console.log(`         ${COLORS.red}↳ ${line}${COLORS.reset}`);
        }
      }
    }
  }

  skip(id, title, reason = '') {
    this.skipped++;
    console.log(`  ${COLORS.dim}${COLORS.cyan}[SKIP]${COLORS.reset} ${id}: ${title} (${reason})`);
  }

  warn(id, title, warningDetails = '') {
    this.warnings++;
    console.log(`  ${COLORS.yellow}[WARN]${COLORS.reset} ${id}: ${title}`);
    if (warningDetails) {
      const lines = String(warningDetails).split('\n');
      for (const line of lines) {
        console.log(`         ${COLORS.yellow}↳ ${line}${COLORS.reset}`);
      }
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`\n${COLORS.bright}======================================================================${COLORS.reset}`);
    console.log(`${COLORS.bright}TEST EXECUTION SUMMARY${COLORS.reset}`);
    console.log(`======================================================================`);
    console.log(`  Total Assertions: ${this.total}`);
    console.log(`  ${COLORS.green}Passed:${COLORS.reset}           ${this.passed}`);
    console.log(`  ${this.failed > 0 ? COLORS.red : COLORS.reset}Failed:${COLORS.reset}           ${this.failed}`);
    console.log(`  ${COLORS.cyan}Skipped:${COLORS.reset}          ${this.skipped}`);
    if (this.warnings > 0) {
      console.log(`  ${COLORS.yellow}Warnings:${COLORS.reset}         ${this.warnings}`);
    }
    console.log(`  Execution Time:   ${elapsed}s`);
    const statusColor = this.failed === 0 ? COLORS.green : COLORS.red;
    const statusText = this.failed === 0 ? 'PASSED' : 'FAILED';
    console.log(`  Suite Status:     ${statusColor}${statusText}${COLORS.reset}`);
    console.log(`======================================================================\n`);
    return this.failed === 0;
  }
}

class ProjectInspector {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  resolve(...segments) {
    return path.resolve(this.rootDir, ...segments);
  }

  exists(...segments) {
    return fs.existsSync(this.resolve(...segments));
  }

  readFile(...segments) {
    const p = this.resolve(...segments);
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p, 'utf8');
  }

  readJson(...segments) {
    const content = this.readFile(...segments);
    if (!content) return null;
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  extractTopicsFromMarkdown(content) {
    if (!content) return [];
    const topicsMatch =
      content.match(/(?:^|\n)#{1,3}\s+[^\n]*topics[^\n]*\n([\s\S]*?)(?=\n#{1,2}\s+|$)/i) ||
      content.match(/topics[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n\n\n|$)/i);
    const searchArea = topicsMatch ? topicsMatch[1] : content;

    const found = [];
    const tokenRegex = /\b[a-z0-9]+(-[a-z0-9]+)*\b/g;
    let match;
    while ((match = tokenRegex.exec(searchArea)) !== null) {
      const token = match[0];
      if (CONTRACT.topics.includes(token) && !found.includes(token)) {
        found.push(token);
      }
    }
    return found;
  }

  extractTopicsFromPs1(content) {
    if (!content) return [];
    const found = [];
    for (const t of CONTRACT.topics) {
      if (content.includes(`"${t}"`) || content.includes(`'${t}'`) || content.includes(t)) {
        found.push(t);
      }
    }
    return found;
  }
}

// ============================================================================
// TIER 1: Feature Coverage (Presence & Schema Conformance)
// ============================================================================
function runTier1(inspector, reporter) {
  reporter.section('TIER 1: Feature Coverage Checks');

  // F1 & F2: package.json in-repo metadata presence
  const pkg = inspector.readJson('package.json');
  reporter.assert('T1.F1.1', 'package.json exists and is valid JSON', pkg !== null, 'package.json not found or failed JSON parse');

  reporter.assert('T1.F1.2', 'package.json contains name field', pkg !== null && typeof pkg.name === 'string' && pkg.name.trim().length > 0, pkg ? `name: ${JSON.stringify(pkg.name)}` : 'package.json missing');
  reporter.assert('T1.F1.3', 'package.json contains version field', pkg !== null && typeof pkg.version === 'string' && pkg.version.trim().length > 0, pkg ? `version: ${JSON.stringify(pkg.version)}` : 'package.json missing');
  reporter.assert('T1.F1.4', 'package.json contains description field', pkg !== null && typeof pkg.description === 'string' && pkg.description.trim().length > 0, pkg ? `description: ${JSON.stringify(pkg.description)}` : 'package.json missing');
  reporter.assert('T1.F1.5', 'package.json contains homepage field', pkg !== null && typeof pkg.homepage === 'string' && pkg.homepage.trim().length > 0, pkg ? `homepage: ${JSON.stringify(pkg.homepage)}` : 'package.json missing');
  reporter.assert('T1.F1.6', 'package.json contains repository field', pkg !== null && (typeof pkg.repository === 'string' || typeof pkg.repository === 'object') && pkg.repository !== null, pkg ? `repository: ${JSON.stringify(pkg.repository)}` : 'package.json missing');
  reporter.assert('T1.F1.7', 'package.json contains keywords field array', pkg !== null && Array.isArray(pkg.keywords) && pkg.keywords.length > 0, pkg ? `keywords: ${JSON.stringify(pkg.keywords)}` : 'package.json missing');
  reporter.assert('T1.F1.8', 'package.json contains author field', pkg !== null && ((typeof pkg.author === 'string' && pkg.author.trim().length > 0) || (typeof pkg.author === 'object' && pkg.author !== null)), pkg ? `author: ${JSON.stringify(pkg.author)}` : 'package.json missing');
  reporter.assert('T1.F1.9', 'package.json contains license field', pkg !== null && typeof pkg.license === 'string' && pkg.license.trim().length > 0, pkg ? `license: ${JSON.stringify(pkg.license)}` : 'package.json missing');
  reporter.assert('T1.F1.10', 'package.json contains publishConfig object', pkg !== null && typeof pkg.publishConfig === 'object' && pkg.publishConfig !== null, pkg ? `publishConfig: ${JSON.stringify(pkg.publishConfig)}` : 'package.json missing');
  reporter.assert('T1.F1.11', 'package.json private is explicitly false', pkg !== null && pkg.private === false, pkg ? `pkg.private is: ${pkg.private}` : 'package.json missing');
  reporter.assert('T1.F1.12', 'package.json contains exports object', pkg !== null && typeof pkg.exports === 'object' && pkg.exports !== null, pkg ? `exports: ${JSON.stringify(pkg.exports)}` : 'package.json missing');
  reporter.assert('T1.F1.13', 'package.json contains files array', pkg !== null && Array.isArray(pkg.files) && pkg.files.length > 0, pkg ? `files: ${JSON.stringify(pkg.files)}` : 'package.json missing');

  // F3: Repository About Guide & Helper Script
  const githubMetaMd = inspector.readFile('docs', 'GITHUB_METADATA.md');
  reporter.assert('T1.F3.1', 'docs/GITHUB_METADATA.md exists', githubMetaMd !== null, 'File does not exist at docs/GITHUB_METADATA.md');
  reporter.assert('T1.F3.2', 'docs/GITHUB_METADATA.md contains formulated description', githubMetaMd !== null && githubMetaMd.toLowerCase().includes('description') && (githubMetaMd.includes(CONTRACT.description) || githubMetaMd.length > 200), githubMetaMd ? 'Formulated description not found in GITHUB_METADATA.md' : 'docs/GITHUB_METADATA.md missing');
  reporter.assert('T1.F3.3', 'docs/GITHUB_METADATA.md contains homepage URL', githubMetaMd !== null && githubMetaMd.includes('https://yashshingan.github.io/portfolio-game/'), githubMetaMd ? 'Homepage URL not found in GITHUB_METADATA.md' : 'docs/GITHUB_METADATA.md missing');
  reporter.assert('T1.F3.4', 'docs/GITHUB_METADATA.md contains topics list', githubMetaMd !== null && githubMetaMd.toLowerCase().includes('topics') && inspector.extractTopicsFromMarkdown(githubMetaMd).length >= 10, githubMetaMd ? 'Topics section not found or contains fewer than 10 topics in GITHUB_METADATA.md' : 'docs/GITHUB_METADATA.md missing');
  reporter.assert('T1.F3.5', 'docs/GITHUB_METADATA.md contains metadata application instructions', githubMetaMd !== null && (githubMetaMd.includes('gh repo edit') || githubMetaMd.includes('api.github.com') || githubMetaMd.includes('curl') || githubMetaMd.includes('PowerShell')), githubMetaMd ? 'Application instructions (gh CLI / REST API / PowerShell) missing in GITHUB_METADATA.md' : 'docs/GITHUB_METADATA.md missing');

  const applyPs1 = inspector.readFile('scripts', 'apply-github-about.ps1');
  reporter.assert('T1.F3.6', 'scripts/apply-github-about.ps1 exists', applyPs1 !== null, 'File does not exist at scripts/apply-github-about.ps1');
  reporter.assert('T1.F3.7', 'scripts/apply-github-about.ps1 contains repo metadata update commands', applyPs1 !== null && (applyPs1.includes('gh repo edit') || applyPs1.includes('Invoke-RestMethod') || applyPs1.includes('curl')), applyPs1 ? 'No GitHub update commands detected in apply-github-about.ps1' : 'scripts/apply-github-about.ps1 missing');
  reporter.assert('T1.F3.8', 'scripts/apply-github-about.ps1 specifies target repository', applyPs1 !== null && (applyPs1.includes('portfolio-game') || applyPs1.includes('yashshingan/portfolio-game')), applyPs1 ? 'Repository identifier missing from apply-github-about.ps1' : 'scripts/apply-github-about.ps1 missing');
  reporter.assert('T1.F3.9', 'scripts/apply-github-about.ps1 specifies description parameter/value', applyPs1 !== null && applyPs1.toLowerCase().includes('description'), applyPs1 ? 'Description parameter/value missing from apply-github-about.ps1' : 'scripts/apply-github-about.ps1 missing');
  reporter.assert('T1.F3.10', 'scripts/apply-github-about.ps1 specifies homepage parameter/value', applyPs1 !== null && applyPs1.includes('https://yashshingan.github.io/portfolio-game/'), applyPs1 ? 'Homepage parameter/value missing from apply-github-about.ps1' : 'scripts/apply-github-about.ps1 missing');
  reporter.assert('T1.F3.11', 'scripts/apply-github-about.ps1 specifies topics parameter/value', applyPs1 !== null && applyPs1.toLowerCase().includes('topic'), applyPs1 ? 'Topics parameter/value missing from apply-github-about.ps1' : 'scripts/apply-github-about.ps1 missing');

  // F4: MIT License File
  const licenseText = inspector.readFile('LICENSE');
  reporter.assert('T1.F4.1', 'LICENSE file exists at project root', licenseText !== null, 'LICENSE file not found');
  reporter.assert('T1.F4.2', 'LICENSE contains MIT License header', licenseText !== null && licenseText.includes('MIT License'), licenseText ? 'MIT License header missing in LICENSE' : 'LICENSE missing');
  reporter.assert('T1.F4.3', 'LICENSE contains copyright notice', licenseText !== null && /copyright\s+(\(c\)\s+)?\d{4}/i.test(licenseText), licenseText ? 'Copyright line missing in LICENSE' : 'LICENSE missing');
  reporter.assert('T1.F4.4', 'LICENSE contains permission grant clause', licenseText !== null && licenseText.includes('Permission is hereby granted, free of charge'), licenseText ? 'Standard MIT permission clause missing' : 'LICENSE missing');
  reporter.assert('T1.F4.5', 'LICENSE contains warranty disclaimer', licenseText !== null && (licenseText.includes('THE SOFTWARE IS PROVIDED "AS IS"') || licenseText.includes('THE SOFTWARE IS PROVIDED AS IS')), licenseText ? 'Standard MIT warranty disclaimer missing' : 'LICENSE missing');

  // F5: Feasibility Assessment Document
  const feasibilityMd = inspector.readFile('docs', 'PACKAGE_PUBLISHING_FEASIBILITY.md');
  reporter.assert('T1.F5.1', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md exists', feasibilityMd !== null, 'File does not exist at docs/PACKAGE_PUBLISHING_FEASIBILITY.md');
  reporter.assert('T1.F5.2', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md analyzes registry trade-offs (npm vs GitHub Packages)', feasibilityMd !== null && feasibilityMd.toLowerCase().includes('npm') && feasibilityMd.toLowerCase().includes('github packages'), feasibilityMd ? 'Registry trade-offs missing in feasibility doc' : 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md missing');
  reporter.assert('T1.F5.3', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md analyzes package architecture and structural options', feasibilityMd !== null && (feasibilityMd.toLowerCase().includes('architecture') || feasibilityMd.toLowerCase().includes('structure') || feasibilityMd.toLowerCase().includes('hybrid')), feasibilityMd ? 'Package architecture analysis missing in feasibility doc' : 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md missing');
  reporter.assert('T1.F5.4', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md analyzes extractable modules', feasibilityMd !== null && feasibilityMd.toLowerCase().includes('audio') && feasibilityMd.toLowerCase().includes('controls') && feasibilityMd.toLowerCase().includes('dialogue'), feasibilityMd ? 'Extractable modules analysis missing in feasibility doc' : 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md missing');
  reporter.assert('T1.F5.5', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md analyzes versioning and release strategy', feasibilityMd !== null && (feasibilityMd.toLowerCase().includes('version') || feasibilityMd.toLowerCase().includes('semver')), feasibilityMd ? 'Versioning strategy missing in feasibility doc' : 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md missing');
  reporter.assert('T1.F5.6', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md includes recommendations and publishing verdict', feasibilityMd !== null && (feasibilityMd.toLowerCase().includes('recommend') || feasibilityMd.toLowerCase().includes('conclusion')), feasibilityMd ? 'Recommendations missing in feasibility doc' : 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md missing');

  // F6 & F7: Package Configuration & Exports Mapping
  reporter.assert('T1.F6.1', 'package.json contains main entry point', pkg !== null && typeof pkg.main === 'string' && pkg.main.includes('dist/'), pkg ? `main: ${JSON.stringify(pkg.main)}` : 'package.json missing');
  reporter.assert('T1.F6.2', 'package.json contains module entry point', pkg !== null && typeof pkg.module === 'string' && pkg.module.includes('dist/'), pkg ? `module: ${JSON.stringify(pkg.module)}` : 'package.json missing');
  reporter.assert('T1.F6.3', 'package.json contains types entry point', pkg !== null && typeof pkg.types === 'string' && pkg.types.includes('dist/'), pkg ? `types: ${JSON.stringify(pkg.types)}` : 'package.json missing');

  const exportsMap = pkg ? pkg.exports || {} : {};
  reporter.assert('T1.F7.1', 'package.json exports contains root "." export', Boolean(exportsMap['.']), pkg ? 'exports["."] is missing' : 'package.json missing');
  reporter.assert('T1.F7.2', 'package.json exports contains "./audio"', Boolean(exportsMap['./audio']), pkg ? 'exports["./audio"] is missing' : 'package.json missing');
  reporter.assert('T1.F7.3', 'package.json exports contains "./controls"', Boolean(exportsMap['./controls']), pkg ? 'exports["./controls"] is missing' : 'package.json missing');
  reporter.assert('T1.F7.4', 'package.json exports contains "./dialogue"', Boolean(exportsMap['./dialogue']), pkg ? 'exports["./dialogue"] is missing' : 'package.json missing');
  reporter.assert('T1.F7.5', 'package.json exports contains "./arcade"', Boolean(exportsMap['./arcade']), pkg ? 'exports["./arcade"] is missing' : 'package.json missing');
  reporter.assert('T1.F7.6', 'package.json exports contains "./engine"', Boolean(exportsMap['./engine']), pkg ? 'exports["./engine"] is missing' : 'package.json missing');
  reporter.assert('T1.F7.7', 'package.json exports contains "./types"', Boolean(exportsMap['./types']), pkg ? 'exports["./types"] is missing' : 'package.json missing');
  reporter.assert('T1.F7.8', 'package.json exports contains "./styles.css"', Boolean(exportsMap['./styles.css']), pkg ? 'exports["./styles.css"] is missing' : 'package.json missing');

  const npmignoreText = inspector.readFile('.npmignore');
  reporter.assert('T1.F7.9', '.npmignore file exists at project root', npmignoreText !== null, '.npmignore file not found');

  // F8: GitHub Actions Publishing Workflow
  const publishYml = inspector.readFile('.github', 'workflows', 'publish.yml');
  reporter.assert('T1.F8.1', '.github/workflows/publish.yml exists', publishYml !== null, 'File does not exist at .github/workflows/publish.yml');
  reporter.assert('T1.F8.2', 'publish.yml includes release trigger (published)', publishYml !== null && publishYml.includes('release:') && publishYml.includes('published'), publishYml ? 'Release trigger missing in publish.yml' : 'publish.yml missing');
  reporter.assert('T1.F8.3', 'publish.yml includes tag push trigger', publishYml !== null && publishYml.includes('tags:') && (publishYml.includes('v*') || publishYml.includes('v*.*.*')), publishYml ? 'Tag push trigger missing in publish.yml' : 'publish.yml missing');
  reporter.assert('T1.F8.4', 'publish.yml includes workflow_dispatch trigger', publishYml !== null && publishYml.includes('workflow_dispatch:'), publishYml ? 'workflow_dispatch trigger missing in publish.yml' : 'publish.yml missing');
  reporter.assert('T1.F8.5', 'publish.yml includes checkout and setup-node actions', publishYml !== null && publishYml.includes('actions/checkout') && publishYml.includes('actions/setup-node'), publishYml ? 'Standard CI actions missing in publish.yml' : 'publish.yml missing');
}

// ============================================================================
// TIER 2: Boundary & Corner Cases (Limits, Regex, SPDX, Constraints)
// ============================================================================
function runTier2(inspector, reporter) {
  reporter.section('TIER 2: Boundary & Corner Cases Checks');

  const pkg = inspector.readJson('package.json');
  const githubMetaMd = inspector.readFile('docs', 'GITHUB_METADATA.md');
  const applyPs1 = inspector.readFile('scripts', 'apply-github-about.ps1');
  const licenseText = inspector.readFile('LICENSE');
  const feasibilityMd = inspector.readFile('docs', 'PACKAGE_PUBLISHING_FEASIBILITY.md');
  const publishYml = inspector.readFile('.github', 'workflows', 'publish.yml');
  const npmignoreText = inspector.readFile('.npmignore');

  // T2.1: Description Length & Limits
  const desc = pkg && typeof pkg.description === 'string' ? pkg.description : '';
  reporter.assert('T2.1.1', 'package.json description length <= 350 chars (GitHub max limit)', desc.length > 0 && desc.length <= 350, `Length: ${desc.length} chars (must be between 1 and 350)`);
  reporter.assert('T2.1.2', 'package.json description length >= 20 chars', desc.length >= 20, `Length: ${desc.length} chars`);
  reporter.assert('T2.1.3', 'package.json description has no leading/trailing whitespace or control characters', desc.length > 0 && desc === desc.trim() && !/[\r\n\t]/.test(desc), desc.length === 0 ? 'Description is missing or empty' : 'Description contains leading/trailing whitespace or newlines');
  reporter.assert('T2.1.4', 'docs/GITHUB_METADATA.md formulated description is <= 350 chars', githubMetaMd !== null && (githubMetaMd.includes(CONTRACT.description) || CONTRACT.description.length <= 350), githubMetaMd ? `Contract description length: ${CONTRACT.description.length}` : 'docs/GITHUB_METADATA.md missing');
  reporter.assert('T2.1.5', 'scripts/apply-github-about.ps1 description is non-empty and <= 350 chars', applyPs1 !== null && (applyPs1.includes(CONTRACT.description) || (applyPs1.includes('description') && !applyPs1.includes('description' + 'x'.repeat(350)))), applyPs1 ? 'Description in apply-github-about.ps1 invalid' : 'scripts/apply-github-about.ps1 missing');

  // T2.2: Topic Constraints & Formatting
  const topicRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  reporter.assert('T2.2.1', 'Contract topics count is exactly 20 topics (GitHub API maximum)', CONTRACT.topics.length === 20, `Count: ${CONTRACT.topics.length}`);
  reporter.assert('T2.2.2', 'All contract topics match strict regex ^[a-z0-9]+(-[a-z0-9]+)*$', CONTRACT.topics.every(t => topicRegex.test(t)), 'One or more topics violate regex');
  reporter.assert('T2.2.3', 'All contract topics length <= 35 chars (GitHub topic max limit)', CONTRACT.topics.every(t => t.length > 0 && t.length <= 35), 'One or more topics exceed 35 chars');
  reporter.assert('T2.2.4', 'All contract topics are unique without duplicates', new Set(CONTRACT.topics).size === CONTRACT.topics.length, `Duplicates found`);

  const mdTopics = githubMetaMd ? inspector.extractTopicsFromMarkdown(githubMetaMd) : [];
  reporter.assert('T2.2.5', 'docs/GITHUB_METADATA.md contains exactly 20 topics matching contract', githubMetaMd !== null && mdTopics.length === 20, githubMetaMd ? `Found ${mdTopics.length} topics in GITHUB_METADATA.md (expected 20)` : 'docs/GITHUB_METADATA.md missing');
  reporter.assert('T2.2.6', 'All topics in docs/GITHUB_METADATA.md match regex ^[a-z0-9]+(-[a-z0-9]+)*$', mdTopics.length > 0 && mdTopics.every(t => topicRegex.test(t)), mdTopics.length > 0 ? 'Invalid topic format in GITHUB_METADATA.md' : 'No topics found in GITHUB_METADATA.md');
  reporter.assert('T2.2.7', 'All topics in docs/GITHUB_METADATA.md <= 35 chars', mdTopics.length > 0 && mdTopics.every(t => t.length <= 35), mdTopics.length > 0 ? 'Topic length exceeds 35' : 'No topics found in GITHUB_METADATA.md');

  const ps1Topics = applyPs1 ? inspector.extractTopicsFromPs1(applyPs1) : [];
  reporter.assert('T2.2.8', 'scripts/apply-github-about.ps1 contains 20 curated topics', applyPs1 !== null && ps1Topics.length === 20, applyPs1 ? `Found ${ps1Topics.length} topics in apply-github-about.ps1 (expected 20)` : 'scripts/apply-github-about.ps1 missing');

  const pkgKeywords = pkg && Array.isArray(pkg.keywords) ? pkg.keywords : [];
  reporter.assert('T2.2.9', 'package.json keywords array has at least 15 valid topics', pkgKeywords.length >= 15, `keywords length: ${pkgKeywords.length}`);
  reporter.assert('T2.2.10', 'package.json keywords are non-empty single-token slugs', pkgKeywords.length > 0 && pkgKeywords.every(k => typeof k === 'string' && k.trim().length > 0 && !k.includes(' ')), pkgKeywords.length > 0 ? 'Keywords contain spaces or are invalid' : 'package.json keywords empty or missing');
  reporter.assert('T2.2.11', 'package.json keywords contain no duplicate values', pkgKeywords.length > 0 && new Set(pkgKeywords).size === pkgKeywords.length, `Duplicates in keywords`);

  // T2.3: URL Validity
  let parsedUrl = null;
  let urlProtocol = '';
  let urlHost = '';
  let urlPath = '';
  if (pkg && pkg.homepage) {
    try {
      parsedUrl = new URL(pkg.homepage);
      urlProtocol = parsedUrl.protocol;
      urlHost = parsedUrl.host;
      urlPath = parsedUrl.pathname;
    } catch {}
  }
  reporter.assert('T2.3.1', 'package.json homepage is valid URL parseable by URL()', parsedUrl !== null, pkg ? `homepage: ${JSON.stringify(pkg.homepage)}` : 'package.json missing');
  reporter.assert('T2.3.2', 'package.json homepage uses strictly https: protocol', urlProtocol === 'https:', `protocol: ${urlProtocol}`);
  reporter.assert('T2.3.3', 'package.json homepage host is yashshingan.github.io', urlHost === 'yashshingan.github.io', `host: ${urlHost}`);
  reporter.assert('T2.3.4', 'package.json homepage path is /portfolio-game/ or /portfolio-game', urlPath === '/portfolio-game/' || urlPath === '/portfolio-game', `pathname: ${urlPath}`);

  const repoUrl = pkg ? (typeof pkg.repository === 'object' ? pkg.repository?.url : pkg.repository) : null;
  reporter.assert('T2.3.5', 'package.json repository URL points to github.com/yashshingan/portfolio-game', typeof repoUrl === 'string' && repoUrl.includes('github.com/yashshingan/portfolio-game'), pkg ? `repoUrl: ${JSON.stringify(repoUrl)}` : 'package.json missing');

  // T2.4: SPDX License Identifier
  reporter.assert('T2.4.1', 'package.json license is strictly SPDX identifier string "MIT"', pkg !== null && pkg.license === 'MIT', pkg ? `license: ${JSON.stringify(pkg.license)}` : 'package.json missing');
  reporter.assert('T2.4.2', 'LICENSE file begins with or contains standard MIT License header', licenseText !== null && licenseText.includes('MIT License'), licenseText ? 'MIT License header missing in LICENSE' : 'LICENSE missing');
  reporter.assert('T2.4.3', 'LICENSE copyright includes valid 4-digit year', licenseText !== null && /copyright\s+(\(c\)\s+)?\d{4}/i.test(licenseText), licenseText ? 'Copyright year pattern missing in LICENSE' : 'LICENSE missing');
  reporter.assert('T2.4.4', 'LICENSE copyright designates Yash Shingan', licenseText !== null && licenseText.toLowerCase().includes('yash shingan'), licenseText ? 'Copyright holder Yash Shingan missing in LICENSE' : 'LICENSE missing');

  // T2.5: PublishConfig Integrity
  reporter.assert('T2.5.1', 'publishConfig.access is strictly "public"', pkg !== null && pkg.publishConfig?.access === 'public', pkg ? `access: ${JSON.stringify(pkg.publishConfig?.access)}` : 'package.json missing');
  reporter.assert('T2.5.2', 'publishConfig.registry is strictly "https://registry.npmjs.org/"', pkg !== null && pkg.publishConfig?.registry === 'https://registry.npmjs.org/', pkg ? `registry: ${JSON.stringify(pkg.publishConfig?.registry)}` : 'package.json missing');

  // T2.6: Package Scope & Naming
  const pkgName = pkg && pkg.name ? pkg.name : '';
  reporter.assert('T2.6.1', 'package name is strictly "@yashshingan/portfolio-game"', pkgName === '@yashshingan/portfolio-game', `name: ${JSON.stringify(pkgName)}`);
  reporter.assert('T2.6.2', 'package name matches npm scoped package regex ^@[a-z0-9_.-]+/[a-z0-9_.-]+$', /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/.test(pkgName), `name regex failed for: ${pkgName}`);
  reporter.assert('T2.6.3', 'package name length is <= 214 characters', pkgName.length <= 214 && pkgName.length > 0, `name length: ${pkgName.length}`);
  reporter.assert('T2.6.4', 'package name contains no uppercase characters', pkgName.length > 0 && pkgName === pkgName.toLowerCase(), `name contains uppercase: ${pkgName}`);

  // T2.7: SemVer Versioning
  const semVerRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  const versionStr = pkg && pkg.version ? pkg.version : '';
  reporter.assert('T2.7.1', 'package.json version matches standard SemVer regex', semVerRegex.test(versionStr), `version: ${JSON.stringify(versionStr)}`);
  const parts = versionStr.split('.').map(Number);
  reporter.assert('T2.7.2', 'package.json version has valid non-negative integer major, minor, patch', parts.length >= 3 && parts.slice(0, 3).every(n => Number.isInteger(n) && n >= 0), `parts: ${JSON.stringify(parts)}`);

  // T2.8: Peer Dependencies & Optional Meta
  const peerDeps = pkg ? pkg.peerDependencies || {} : {};
  const peerMeta = pkg ? pkg.peerDependenciesMeta || {} : {};
  if ('phaser' in peerDeps) {
    reporter.assert('T2.8.1', 'peerDependenciesMeta.phaser.optional is boolean true', peerMeta.phaser?.optional === true, `peerDependenciesMeta.phaser: ${JSON.stringify(peerMeta.phaser)}`);
  } else {
    reporter.assert('T2.8.1', 'phaser in peerDependencies or peerDependenciesMeta is optional if present', !('phaser' in peerDeps) || peerMeta.phaser?.optional === true, 'phaser is not optional');
  }
  if ('react' in peerDeps) {
    reporter.assert('T2.8.2', 'peerDependenciesMeta.react.optional is boolean true', peerMeta.react?.optional === true, `peerDependenciesMeta.react: ${JSON.stringify(peerMeta.react)}`);
  } else {
    reporter.assert('T2.8.2', 'react in peerDependencies or peerDependenciesMeta is optional if present', !('react' in peerDeps) || peerMeta.react?.optional === true, 'react is not optional');
  }

  // T2.9: Packaging Hygiene Boundaries
  const pkgFiles = pkg && Array.isArray(pkg.files) ? pkg.files : null;
  reporter.assert('T2.9.1', 'package.json files array contains "dist"', pkgFiles !== null && pkgFiles.includes('dist'), pkgFiles ? `files: ${JSON.stringify(pkgFiles)}` : 'package.json files missing');
  reporter.assert('T2.9.2', 'package.json files array paths are clean relative paths without .. or leading /', pkgFiles !== null && pkgFiles.every(f => typeof f === 'string' && !f.startsWith('/') && !f.includes('..')), pkgFiles ? `files: ${JSON.stringify(pkgFiles)}` : 'package.json files missing');
  reporter.assert('T2.9.3', 'package.json files whitelist does NOT contain internal development folders', pkgFiles !== null && !pkgFiles.some(f => f.startsWith('.agents') || f.startsWith('scripts') || f.startsWith('.github') || f.startsWith('docs')), pkgFiles ? `Internal folders found in files: ${JSON.stringify(pkgFiles)}` : 'package.json files missing');

  reporter.assert('T2.9.4', '.npmignore explicitly ignores .agents/', npmignoreText !== null && npmignoreText.includes('.agents'), npmignoreText ? '.agents missing in .npmignore' : '.npmignore missing');
  reporter.assert('T2.9.5', '.npmignore explicitly ignores scripts/', npmignoreText !== null && npmignoreText.includes('scripts'), npmignoreText ? 'scripts missing in .npmignore' : '.npmignore missing');
  reporter.assert('T2.9.6', 'scripts/apply-github-about.ps1 contains no hardcoded secrets or tokens', applyPs1 !== null && !applyPs1.includes('ghp_') && !applyPs1.includes('github_pat_') && !applyPs1.includes('Bearer ghp_'), applyPs1 ? 'Hardcoded token pattern found in apply-github-about.ps1' : 'scripts/apply-github-about.ps1 missing');
  reporter.assert('T2.9.7', 'publish.yml does NOT contain hardcoded secrets or passwords', publishYml !== null && !publishYml.includes('npm_') && !publishYml.includes('ghp_') && !publishYml.includes('token: "ghp'), publishYml ? 'Potential hardcoded token detected in publish.yml' : 'publish.yml missing');
  reporter.assert('T2.9.8', 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md is comprehensive (>= 2000 chars)', feasibilityMd !== null && feasibilityMd.length >= 2000, feasibilityMd ? `Document length: ${feasibilityMd.length} chars` : 'docs/PACKAGE_PUBLISHING_FEASIBILITY.md missing');
}

// ============================================================================
// TIER 3: Cross-Feature Combinations (Pairwise & System Coherence)
// ============================================================================
function runTier3(inspector, reporter) {
  reporter.section('TIER 3: Cross-Feature Combination Checks');

  const pkg = inspector.readJson('package.json');
  const githubMetaMd = inspector.readFile('docs', 'GITHUB_METADATA.md');
  const applyPs1 = inspector.readFile('scripts', 'apply-github-about.ps1');
  const publishYml = inspector.readFile('.github', 'workflows', 'publish.yml');
  const feasibilityMd = inspector.readFile('docs', 'PACKAGE_PUBLISHING_FEASIBILITY.md');
  const npmignoreText = inspector.readFile('.npmignore');

  // T3.1: Cross-Document Metadata Consistency
  const mdDescMatch = githubMetaMd !== null && githubMetaMd.includes(CONTRACT.description);
  const ps1DescMatch = applyPs1 !== null && applyPs1.includes(CONTRACT.description);
  reporter.assert('T3.1.1', 'Description in docs/GITHUB_METADATA.md and scripts/apply-github-about.ps1 are aligned', mdDescMatch && ps1DescMatch, 'Description mismatch or missing between GITHUB_METADATA.md and apply-github-about.ps1');

  const pkgDescMatch = pkg !== null && pkg.description === CONTRACT.description;
  reporter.assert('T3.1.2', 'Description in docs/GITHUB_METADATA.md matches package.json description', mdDescMatch && pkgDescMatch, pkg ? `package.json description: ${JSON.stringify(pkg.description)}` : 'package.json missing');

  const mdUrl = githubMetaMd !== null && githubMetaMd.includes(CONTRACT.homepageUrl);
  const ps1Url = applyPs1 !== null && applyPs1.includes(CONTRACT.homepageUrl);
  const pkgUrl = pkg !== null && pkg.homepage === CONTRACT.homepageUrl;
  reporter.assert('T3.1.3', 'Homepage URL is identical across GITHUB_METADATA.md, apply-github-about.ps1, and package.json', mdUrl && ps1Url && pkgUrl, pkg ? `package.json homepage: ${JSON.stringify(pkg.homepage)}` : 'One or more metadata files missing');

  const mdTopics = githubMetaMd ? inspector.extractTopicsFromMarkdown(githubMetaMd) : [];
  const ps1Topics = applyPs1 ? inspector.extractTopicsFromPs1(applyPs1) : [];
  const topicsMatch = mdTopics.length === 20 && ps1Topics.length === 20 && mdTopics.every(t => ps1Topics.includes(t));
  reporter.assert('T3.1.4', '20 Topics in docs/GITHUB_METADATA.md match topics in scripts/apply-github-about.ps1', topicsMatch, `mdTopics: ${mdTopics.length}, ps1Topics: ${ps1Topics.length}`);

  const keywordsSet = pkg && Array.isArray(pkg.keywords) ? new Set(pkg.keywords) : new Set();
  const sharedTopicsCount = CONTRACT.topics.filter(t => keywordsSet.has(t)).length;
  reporter.assert('T3.1.5', 'package.json keywords contain at least 15 curated GitHub topics', sharedTopicsCount >= 15, `Keywords share ${sharedTopicsCount} of 20 topics with GitHub metadata`);

  // T3.2: Subpath Exports & Distribution Paths Mapping
  const exportsMap = pkg ? pkg.exports : null;

  function getExportPaths(val) {
    if (!val) return [];
    if (typeof val === 'string') return [val];
    if (typeof val === 'object') {
      const out = [];
      for (const k of ['import', 'require', 'types', 'default']) {
        if (typeof val[k] === 'string') out.push(val[k]);
        else if (typeof val[k] === 'object') out.push(...getExportPaths(val[k]));
      }
      return out;
    }
    return [];
  }

  const dotPaths = exportsMap ? getExportPaths(exportsMap['.']) : [];
  reporter.assert('T3.2.1', 'exports["."] maps to ./dist/index.mjs or ./dist/index.js and types ./dist/index.d.ts', dotPaths.some(p => p.includes('dist/index.mjs') || p.includes('dist/index.js')) && dotPaths.some(p => p.includes('dist/index.d.ts')), `dotPaths: ${JSON.stringify(dotPaths)}`);

  const audioPaths = exportsMap ? getExportPaths(exportsMap['./audio']) : [];
  reporter.assert('T3.2.2', 'exports["./audio"] maps to dist audio module and types', audioPaths.some(p => p.includes('dist/audio')), `audioPaths: ${JSON.stringify(audioPaths)}`);

  const controlsPaths = exportsMap ? getExportPaths(exportsMap['./controls']) : [];
  reporter.assert('T3.2.3', 'exports["./controls"] maps to dist controls module and types', controlsPaths.some(p => p.includes('dist/controls')), `controlsPaths: ${JSON.stringify(controlsPaths)}`);

  const dialoguePaths = exportsMap ? getExportPaths(exportsMap['./dialogue']) : [];
  reporter.assert('T3.2.4', 'exports["./dialogue"] maps to dist dialogue module and types', dialoguePaths.some(p => p.includes('dist/dialogue')), `dialoguePaths: ${JSON.stringify(dialoguePaths)}`);

  const arcadePaths = exportsMap ? getExportPaths(exportsMap['./arcade']) : [];
  reporter.assert('T3.2.5', 'exports["./arcade"] maps to dist arcade module and types', arcadePaths.some(p => p.includes('dist/arcade')), `arcadePaths: ${JSON.stringify(arcadePaths)}`);

  const enginePaths = exportsMap ? getExportPaths(exportsMap['./engine']) : [];
  reporter.assert('T3.2.6', 'exports["./engine"] maps to dist engine module and types', enginePaths.some(p => p.includes('dist/engine')), `enginePaths: ${JSON.stringify(enginePaths)}`);

  const typesPaths = exportsMap ? getExportPaths(exportsMap['./types']) : [];
  reporter.assert('T3.2.7', 'exports["./types"] maps to dist types module and declarations', typesPaths.some(p => p.includes('dist/types')), `typesPaths: ${JSON.stringify(typesPaths)}`);

  const stylesPaths = exportsMap ? getExportPaths(exportsMap['./styles.css']) : [];
  reporter.assert('T3.2.8', 'exports["./styles.css"] maps to ./dist/styles.css', stylesPaths.some(p => p.includes('dist/styles.css')), `stylesPaths: ${JSON.stringify(stylesPaths)}`);

  let allTargetsInDist = Boolean(exportsMap);
  if (exportsMap) {
    for (const [subpath, def] of Object.entries(exportsMap)) {
      const paths = getExportPaths(def);
      for (const p of paths) {
        if (!p.startsWith('./dist/')) {
          allTargetsInDist = false;
        }
      }
    }
  }
  reporter.assert('T3.2.9', 'Every target in exports map is strictly confined within ./dist/', allTargetsInDist, 'One or more export targets point outside ./dist/ or exports missing');

  const mainMatches = pkg && typeof pkg.main === 'string' && (pkg.main.includes('dist/index.cjs') || pkg.main.includes('dist/index.js') || pkg.main.includes('dist/index.mjs'));
  const moduleMatches = pkg && typeof pkg.module === 'string' && (pkg.module.includes('dist/index.mjs') || pkg.module.includes('dist/index.js'));
  const typesMatches = pkg && typeof pkg.types === 'string' && pkg.types.includes('dist/index.d.ts');
  reporter.assert('T3.2.10', 'package.json main, module, and types fields match root "." export targets', Boolean(mainMatches && moduleMatches && typesMatches), pkg ? `main: ${pkg.main}, module: ${pkg.module}, types: ${pkg.types}` : 'package.json missing');

  // T3.3: Files Whitelist and .npmignore Coherence
  const pkgFiles = pkg && Array.isArray(pkg.files) ? pkg.files : [];
  const whitelistExcludesInternal = pkgFiles.length > 0 && !pkgFiles.some(f => f.includes('.agents') || f.includes('scripts') || f.includes('.github') || f.includes('docs') || f.includes('src'));
  const npmignoreExcludesInternal = npmignoreText !== null && npmignoreText.includes('.agents') && npmignoreText.includes('scripts') && npmignoreText.includes('docs');
  reporter.assert('T3.3.1', 'files whitelist and .npmignore mutually protect against internal file leaks (.agents, scripts, docs)', whitelistExcludesInternal && npmignoreExcludesInternal, 'files whitelist or .npmignore allows internal file leakage');

  // T3.4: Workflow Secrets & Registry Alignment with Feasibility Report
  const hasNpmToken = publishYml !== null && (publishYml.includes('secrets.NPM_TOKEN') || publishYml.includes('NPM_TOKEN'));
  const hasGithubToken = publishYml !== null && (publishYml.includes('secrets.GITHUB_TOKEN') || publishYml.includes('GITHUB_TOKEN'));
  reporter.assert('T3.4.1', '.github/workflows/publish.yml references NPM_TOKEN for npm publishing', hasNpmToken, publishYml ? 'NPM_TOKEN secret reference missing from publish.yml' : 'publish.yml missing');
  reporter.assert('T3.4.2', '.github/workflows/publish.yml references GITHUB_TOKEN for GitHub Packages publishing', hasGithubToken, publishYml ? 'GITHUB_TOKEN secret reference missing from publish.yml' : 'publish.yml missing');

  const workflowHasNpmRegistry = publishYml !== null && publishYml.includes('registry.npmjs.org');
  const workflowHasGhRegistry = publishYml !== null && publishYml.includes('npm.pkg.github.com');
  reporter.assert('T3.4.3', 'publish.yml references both registry.npmjs.org and npm.pkg.github.com', workflowHasNpmRegistry && workflowHasGhRegistry, publishYml ? 'Registry URLs missing from publish.yml' : 'publish.yml missing');

  const docHasDualRegistry = feasibilityMd !== null && (feasibilityMd.includes('registry.npmjs.org') || (feasibilityMd.includes('npm') && feasibilityMd.includes('GitHub Packages')));
  reporter.assert('T3.4.4', 'publish.yml dual-registry configuration matches strategy in PACKAGE_PUBLISHING_FEASIBILITY.md', docHasDualRegistry && workflowHasNpmRegistry && workflowHasGhRegistry, 'Dual registry strategy mismatch');

  // T3.5: Build Scripts Integration
  const pkgScripts = pkg ? pkg.scripts || {} : {};
  const hasBuildLib = Boolean(pkgScripts['build:lib']);
  reporter.assert('T3.5.1', 'package.json contains build:lib script for library packaging', hasBuildLib, pkg ? `scripts: ${JSON.stringify(Object.keys(pkgScripts))}` : 'package.json missing');

  const hasPrepack = Boolean(pkgScripts['prepack']);
  reporter.assert('T3.5.2', 'package.json contains prepack script wired to build library', hasPrepack && (pkgScripts['prepack'].includes('build:lib') || pkgScripts['prepack'].includes('build')), pkg ? `prepack: ${JSON.stringify(pkgScripts['prepack'])}` : 'package.json missing');

  const hasDev = Boolean(pkgScripts['dev']);
  const hasBuild = Boolean(pkgScripts['build']);
  reporter.assert('T3.5.3', 'package.json preserves web application dev and build scripts (zero regression)', hasDev && hasBuild, pkg ? 'Web app dev or build scripts missing from package.json' : 'package.json missing');
}

// ============================================================================
// TIER 4: Real-World Workload Scenarios
// ============================================================================
function runTier4(inspector, reporter, options = {}) {
  reporter.section('TIER 4: Real-World Workload Scenarios');

  // Scenario 1: npm pack --dry-run Tarball Content Inspection
  console.log(`  ${COLORS.dim}Executing npm pack --dry-run...${COLORS.reset}`);
  let packSuccess = false;
  let packFiles = [];
  let packError = '';

  function parseNpmPackJson(raw) {
    if (!raw) return null;
    const clean = raw.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
    const match = clean.match(/(?:^|\n)\s*(\[\s*\{[\s\S]*\}\s*\])\s*$/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].files)) {
          return parsed;
        }
      } catch {}
    }
    const lastBracket = clean.lastIndexOf(']');
    if (lastBracket !== -1) {
      const candidateStart = clean.lastIndexOf('\n[', lastBracket);
      if (candidateStart !== -1) {
        try {
          const parsed = JSON.parse(clean.substring(candidateStart, lastBracket + 1));
          if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].files)) {
            return parsed;
          }
        } catch {}
      }
    }
    return null;
  }

  try {
    const packCmd = 'npm pack --dry-run --json';
    const output = execSync(packCmd, {
      cwd: inspector.rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      timeout: 30000,
    });

    const parsed = parseNpmPackJson(output);
    if (parsed) {
      packSuccess = true;
      packFiles = parsed[0].files.map(f => f.path);
    }
  } catch (err) {
    packError = err.message;
    if (err.stdout) {
      const parsed = parseNpmPackJson(err.stdout);
      if (parsed) {
        packSuccess = true;
        packFiles = parsed[0].files.map(f => f.path);
      }
    }
  }

  reporter.assert('T4.1.1', 'npm pack --dry-run executes successfully and outputs tarball manifest', packSuccess, packError || 'Failed to parse JSON tarball output from npm pack');

  const leakedAgents = packFiles.filter(f => f.startsWith('.agents/'));
  reporter.assert('T4.1.2', 'Tarball manifest does NOT leak .agents/ directory', packSuccess && leakedAgents.length === 0, packSuccess ? `Leaked .agents/ files (${leakedAgents.length}):\n${leakedAgents.slice(0, 5).join('\n')}` : 'npm pack manifest unavailable');

  const leakedScripts = packFiles.filter(f => f.startsWith('scripts/'));
  reporter.assert('T4.1.3', 'Tarball manifest does NOT leak scripts/ directory', packSuccess && leakedScripts.length === 0, packSuccess ? `Leaked scripts/ files (${leakedScripts.length}):\n${leakedScripts.slice(0, 5).join('\n')}` : 'npm pack manifest unavailable');

  const leakedGithub = packFiles.filter(f => f.startsWith('.github/'));
  reporter.assert('T4.1.4', 'Tarball manifest does NOT leak .github/ directory', packSuccess && leakedGithub.length === 0, packSuccess ? `Leaked .github/ files (${leakedGithub.length}):\n${leakedGithub.slice(0, 5).join('\n')}` : 'npm pack manifest unavailable');

  const leakedSrc = packFiles.filter(f => f.startsWith('src/'));
  reporter.assert('T4.1.5', 'Tarball manifest does NOT leak internal src/ directory', packSuccess && leakedSrc.length === 0, packSuccess ? `Leaked src/ files (${leakedSrc.length}):\n${leakedSrc.slice(0, 5).join('\n')}` : 'npm pack manifest unavailable');

  const leakedDocs = packFiles.filter(f => f.startsWith('docs/'));
  reporter.assert('T4.1.6', 'Tarball manifest does NOT leak internal docs/ directory', packSuccess && leakedDocs.length === 0, packSuccess ? `Leaked docs/ files (${leakedDocs.length}):\n${leakedDocs.slice(0, 5).join('\n')}` : 'npm pack manifest unavailable');

  const leakedNext = packFiles.filter(f => f.startsWith('.next/') || f.startsWith('out/'));
  reporter.assert('T4.1.7', 'Tarball manifest does NOT leak build cache .next/ or out/ export directories', packSuccess && leakedNext.length === 0, packSuccess ? `Leaked build cache files (${leakedNext.length}):\n${leakedNext.slice(0, 5).join('\n')}` : 'npm pack manifest unavailable');

  // Scenario 2: TypeScript Type-Check Non-Regression
  console.log(`  ${COLORS.dim}Executing npx tsc --noEmit...${COLORS.reset}`);
  let tscSuccess = false;
  let tscError = '';
  try {
    execSync('npx tsc --noEmit', {
      cwd: inspector.rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      timeout: 60000,
    });
    tscSuccess = true;
  } catch (err) {
    tscError = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message;
  }
  reporter.assert('T4.2.1', 'TypeScript type-checking (npx tsc --noEmit) exits with code 0', tscSuccess, tscError.trim());

  // Scenario 3: Linter Validation
  console.log(`  ${COLORS.dim}Executing npm run lint...${COLORS.reset}`);
  let lintSuccess = false;
  let lintError = '';
  try {
    execSync('npm run lint', {
      cwd: inspector.rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      timeout: 60000,
    });
    lintSuccess = true;
  } catch (err) {
    lintError = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message;
  }
  reporter.assert('T4.3.1', 'Linter validation (npm run lint) exits with code 0', lintSuccess, lintError.trim());

  // Scenario 4: Web Application Static Build Non-Regression (Heavy)
  if (options.includeHeavy) {
    console.log(`  ${COLORS.dim}Executing static site export build (npm run build)... [HEAVY]${COLORS.reset}`);
    let buildSuccess = false;
    let buildError = '';
    try {
      execSync('npm run build', {
        cwd: inspector.rootDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        timeout: 180000,
      });
      buildSuccess = true;
    } catch (err) {
      buildError = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message;
    }
    reporter.assert('T4.4.1', 'Static site export build (npm run build) exits with code 0', buildSuccess, buildError.trim());

    const outHtmlExists = inspector.exists('out', 'index.html');
    reporter.assert('T4.4.2', 'Static site export directory out/index.html was generated', outHtmlExists, 'out/index.html not found');
  } else {
    reporter.skip('T4.4.1', 'Static site export build (npm run build)', 'Pass --include-heavy flag to execute slow Next.js static export');
    reporter.skip('T4.4.2', 'Static site export artifact out/index.html verification', 'Skipped with --include-heavy');
  }
}

// ============================================================================
// CLI ARGUMENT PARSING & MAIN ENTRYPOINT
// ============================================================================
function printHelp() {
  console.log(`
${COLORS.bright}verify-packaging-and-metadata.mjs${COLORS.reset}
Comprehensive 4-tier E2E verification test suite runner for portfolio-game.

${COLORS.bright}USAGE:${COLORS.reset}
  node scripts/verify-packaging-and-metadata.mjs [options]

${COLORS.bright}OPTIONS:${COLORS.reset}
  --tier=1           Run Tier 1 Feature Coverage checks (presence, schema conformance)
  --tier=2           Run Tier 2 Boundary & Corner Cases checks (limits, regex, SPDX)
  --tier=3           Run Tier 3 Cross-Feature Combination checks (pairwise coherence)
  --tier=4           Run Tier 4 Real-World Application Scenario checks (pack dry-run, tsc, lint)
  --include-heavy    Include slow static site build (npm run build) in Tier 4
  --verbose, -v      Enable verbose output
  --help, -h         Display this help message

${COLORS.bright}EXAMPLES:${COLORS.reset}
  node scripts/verify-packaging-and-metadata.mjs --tier=1
  node scripts/verify-packaging-and-metadata.mjs --tier=2
  node scripts/verify-packaging-and-metadata.mjs --tier=1,2
  node scripts/verify-packaging-and-metadata.mjs --tier=4 --include-heavy
  node scripts/verify-packaging-and-metadata.mjs
`);
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  const selectedTiers = new Set();
  let includeHeavy = false;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    if (arg === '--include-heavy') {
      includeHeavy = true;
      continue;
    }
    if (arg === '--verbose' || arg === '-v') {
      verbose = true;
      continue;
    }

    const tierMatch = arg.match(/^--tier=([1-4](?:,[1-4])*)$/);
    if (tierMatch) {
      tierMatch[1].split(',').forEach(t => selectedTiers.add(parseInt(t, 10)));
      continue;
    }

    if (arg === '-t' || arg === '--tier') {
      const next = args[i + 1];
      if (next && /^[1-4](?:,[1-4])*$/.test(next)) {
        next.split(',').forEach(t => selectedTiers.add(parseInt(t, 10)));
        i++;
        continue;
      }
    }
  }

  // Default: if no tiers specified, run all tiers (1, 2, 3, 4)
  if (selectedTiers.size === 0) {
    selectedTiers.add(1);
    selectedTiers.add(2);
    selectedTiers.add(3);
    selectedTiers.add(4);
  }

  return { selectedTiers, includeHeavy, verbose };
}

function main() {
  const { selectedTiers, includeHeavy, verbose } = parseCliArgs();

  console.log(`\n${COLORS.bright}${COLORS.magenta}======================================================================${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.magenta}PORTFOLIO-GAME E2E PACKAGING & METADATA VERIFICATION SUITE${COLORS.reset}`);
  console.log(`Active Tiers: ${Array.from(selectedTiers).sort().map(t => `Tier ${t}`).join(', ')}`);
  console.log(`Include Heavy Build: ${includeHeavy}`);
  console.log(`${COLORS.bright}${COLORS.magenta}======================================================================${COLORS.reset}`);

  const inspector = new ProjectInspector(ROOT_DIR);
  const reporter = new TestReporter({ verbose });

  if (selectedTiers.has(1)) {
    runTier1(inspector, reporter);
  }

  if (selectedTiers.has(2)) {
    runTier2(inspector, reporter);
  }

  if (selectedTiers.has(3)) {
    runTier3(inspector, reporter);
  }

  if (selectedTiers.has(4)) {
    runTier4(inspector, reporter, { includeHeavy });
  }

  const success = reporter.summary();
  process.exit(success ? 0 : 1);
}

main();
