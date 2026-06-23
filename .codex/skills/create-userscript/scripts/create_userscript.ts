#!/usr/bin/env bun

import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const AUTOMATED_COMMENT =
  '<!-- DO NOT TOUCH: AUTOMATED INSERTION POINT FOR NEXT USERSCRIPT CARD -->';
const REPO_NAMESPACE = 'https://github.com/Yash-Singh1/UserScripts';
const AUTHOR = 'Yash Singh';
const SUPPORT_URL = 'https://github.com/Yash-Singh1/UserScripts/issues';

const MULTI_META_KEYS = new Set([
  'match',
  'include',
  'exclude',
  'grant',
  'require',
  'resource',
  'connect'
]);
const PASSTHROUGH_META_KEYS = [
  'run-at',
  'sandbox',
  'noframes',
  'unwrap'
] as const;
const GENERATED_META_KEYS = new Set([
  'name',
  'namespace',
  'version',
  'description',
  'author',
  'homepage',
  'homepageURL',
  'supportURL',
  'license',
  'downloadURL',
  'updateURL'
]);

type Metadata = Record<string, string[]>;
type Spec = Record<string, unknown>;

class UserscriptError extends Error {}

interface CliArgs {
  repo: string;
  spec?: string;
  rawFile?: string;
  raw?: string;
  codeFile?: string;
  code?: string;
  name?: string;
  description?: string;
  match: string[];
  icon?: string;
  keyword: string[];
  keywords?: string;
  version: string;
  grant: string[];
  runAt?: string;
  extraMeta: string[];
  dryRun: boolean;
}

function usage(): string {
  return `Usage: bun create_userscript.ts [options]

Create a UserScripts repo entry from raw userscript text or structured fields.

Options:
  --repo <path>              Path to the UserScripts repo. Defaults to cwd.
  --spec <file>              JSON file with userscript fields.
  --raw-file <file>          File containing a full userscript with metadata block.
  --raw <text>               Full userscript text with metadata block.
  --code-file <file>         File containing only the runtime userscript body.
  --code <text>              Runtime userscript body.
  --name <name>              Userscript display name.
  --description <text>       Userscript description.
  --match <pattern>          Target URL pattern. Repeatable.
  --icon <url>               Userscript icon URL.
  --keyword <keyword>        Docs keyword. Repeatable.
  --keywords <keywords>      Space-separated docs keywords.
  --version <version>        Generated userscript version. Defaults to 0.1.
  --grant <value>            Grant value. Repeatable. Defaults to none.
  --run-at <value>           Optional @run-at value.
  --extra-meta <KEY=VALUE>   Extra metadata line, for example require=https://...
  --dry-run                  Print planned writes without modifying files.
  --help                     Show this help.`;
}

function readOption(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new UserscriptError(`${flag} requires a value.`);
  }
  return value;
}

function parseArgs(argv = Bun.argv.slice(2)): CliArgs {
  const args: CliArgs = {
    repo: '.',
    match: [],
    keyword: [],
    version: '0.1',
    grant: [],
    extraMeta: [],
    dryRun: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--repo':
        args.repo = readOption(argv, i, arg);
        i++;
        break;
      case '--spec':
        args.spec = readOption(argv, i, arg);
        i++;
        break;
      case '--raw-file':
        args.rawFile = readOption(argv, i, arg);
        i++;
        break;
      case '--raw':
        args.raw = readOption(argv, i, arg);
        i++;
        break;
      case '--code-file':
        args.codeFile = readOption(argv, i, arg);
        i++;
        break;
      case '--code':
        args.code = readOption(argv, i, arg);
        i++;
        break;
      case '--name':
        args.name = readOption(argv, i, arg);
        i++;
        break;
      case '--description':
        args.description = readOption(argv, i, arg);
        i++;
        break;
      case '--match':
        args.match.push(readOption(argv, i, arg));
        i++;
        break;
      case '--icon':
        args.icon = readOption(argv, i, arg);
        i++;
        break;
      case '--keyword':
        args.keyword.push(readOption(argv, i, arg));
        i++;
        break;
      case '--keywords':
        args.keywords = readOption(argv, i, arg);
        i++;
        break;
      case '--version':
        args.version = readOption(argv, i, arg);
        i++;
        break;
      case '--grant':
        args.grant.push(readOption(argv, i, arg));
        i++;
        break;
      case '--run-at':
        args.runAt = readOption(argv, i, arg);
        i++;
        break;
      case '--extra-meta':
        args.extraMeta.push(readOption(argv, i, arg));
        i++;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--help':
      case '-h':
        console.log(usage());
        process.exit(0);
      default:
        throw new UserscriptError(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

async function readText(filePath: string): Promise<string> {
  return await Bun.file(filePath).text();
}

async function loadSpec(args: CliArgs): Promise<Spec> {
  const spec: Spec = {};
  if (args.spec) Object.assign(spec, JSON.parse(await readText(args.spec)));
  if (args.rawFile) spec.raw = await readText(args.rawFile);
  if (args.raw) spec.raw = args.raw;
  if (args.codeFile) spec.code = await readText(args.codeFile);
  if (args.code) spec.code = args.code;
  if (args.name) spec.name = args.name;
  if (args.description) spec.description = args.description;
  if (args.icon) spec.icon = args.icon;
  if (args.version) spec.version = args.version;
  if (args.runAt) spec.run_at = args.runAt;
  if (args.match.length) spec.match = args.match;
  if (args.grant.length) spec.grant = args.grant;

  const keywords = [
    ...(args.keywords ? args.keywords.split(/\s+/).filter(Boolean) : []),
    ...args.keyword
  ];
  if (keywords.length) spec.keywords = keywords;

  if (args.extraMeta.length) {
    const extra = {
      ...((spec.extra_meta as Record<string, unknown> | undefined) ?? {})
    };
    for (const item of args.extraMeta) {
      if (!item.includes('=')) {
        throw new UserscriptError(
          `--extra-meta must be KEY=VALUE, got ${JSON.stringify(item)}`
        );
      }
      const [key, ...rest] = item.split('=');
      const value = rest.join('=');
      const current = extra[key];
      extra[key] = [...asList(current), value];
    }
    spec.extra_meta = extra;
  }

  return spec;
}

function parseMetadataBlock(raw: string): [Metadata, string] {
  const match = raw.match(
    /\/\/\s*==UserScript==(?<meta>[\s\S]*?)\/\/\s*==\/UserScript==(?<body>[\s\S]*)/
  );
  if (!match?.groups) {
    throw new UserscriptError(
      'Raw userscript is missing a // ==UserScript== metadata block.'
    );
  }

  const metadata: Metadata = {};
  for (const line of match.groups.meta.split(/\r?\n/)) {
    const parsed = line.match(/^\s*\/\/\s*@(\S+)\s*(.*?)\s*$/);
    if (!parsed) continue;
    const [, key, value] = parsed;
    metadata[key] ??= [];
    metadata[key].push(value.trim());
  }

  return [metadata, match.groups.body.replace(/^\r?\n/, '')];
}

function asList(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const stringValue = String(value);
  return stringValue ? [stringValue] : [];
}

function first(
  spec: Spec,
  metadata: Metadata,
  key: string,
  defaultValue = ''
): string {
  const value = spec[key];
  if (Array.isArray(value))
    return value.length ? String(value[0]) : defaultValue;
  if (value) return String(value);
  return metadata[key]?.[0] ?? defaultValue;
}

function shortName(name: string): string {
  return name.replaceAll(' ', '_');
}

function collectMetadata(spec: Spec, parsed: Metadata): Metadata {
  const merged: Metadata = {};
  for (const [key, values] of Object.entries(parsed)) {
    if (!GENERATED_META_KEYS.has(key) && key !== 'icon')
      merged[key] = [...values];
  }

  const aliases: Record<string, string> = { run_at: 'run-at' };
  for (const [key, value] of Object.entries(spec)) {
    const metaKey = aliases[key] ?? key;
    if (['raw', 'code', 'keywords', 'extra_meta', 'version'].includes(metaKey))
      continue;
    if (GENERATED_META_KEYS.has(metaKey)) continue;
    if (
      MULTI_META_KEYS.has(metaKey) ||
      PASSTHROUGH_META_KEYS.includes(metaKey as never) ||
      metaKey === 'icon'
    ) {
      merged[metaKey] = asList(value);
    }
  }

  const extraMeta =
    (spec.extra_meta as Record<string, unknown> | undefined) ?? {};
  for (const [key, value] of Object.entries(extraMeta)) {
    if (!GENERATED_META_KEYS.has(key)) merged[key] = asList(value);
  }

  return merged;
}

function metadataLines(meta: Metadata, key: string): string[] {
  return (meta[key] ?? [])
    .filter((value) => value !== '')
    .map((value) => `// @${key.padEnd(12)} ${value}`.trimEnd());
}

function renderUserscript(spec: Spec): {
  slug: string;
  name: string;
  userscriptText: string;
  description: string;
  keywords: string[];
} {
  let parsedMeta: Metadata = {};
  let code = String(spec.code ?? '');
  if (spec.raw) {
    const [metadata, rawBody] = parseMetadataBlock(String(spec.raw));
    parsedMeta = metadata;
    if (!code) code = rawBody;
  }

  const name = first(spec, parsedMeta, 'name');
  const description = first(spec, parsedMeta, 'description');
  if (!name) throw new UserscriptError('Missing userscript name.');
  if (!description)
    throw new UserscriptError('Missing userscript description.');
  if (!code.trim()) throw new UserscriptError('Missing userscript code body.');

  const slug = shortName(name);
  const meta = collectMetadata(spec, parsedMeta);
  if (!(meta.match ?? []).length)
    throw new UserscriptError('Missing at least one @match URL pattern.');

  const version = String(
    spec.version || first(spec, parsedMeta, 'version', '0.1') || '0.1'
  );
  const icon = first(spec, parsedMeta, 'icon');
  meta.grant = (meta.grant ?? []).length ? meta.grant : ['none'];

  let keywords = asList(spec.keywords);
  if (!keywords.length)
    keywords = name.toLowerCase().match(/[A-Za-z0-9+.-]+/g) ?? [];

  const repoPath = `https://github.com/Yash-Singh1/UserScripts/tree/main/${slug}#readme`;
  const rawPath = `https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/${slug}/${slug}.user.js`;

  const lines = [
    '// ==UserScript==',
    `// @name         ${name}`,
    `// @namespace    ${REPO_NAMESPACE}`,
    `// @version      ${version}`,
    `// @description  ${description}`,
    `// @author       ${AUTHOR}`,
    ...metadataLines(meta, 'match')
  ];
  if (icon) lines.push(`// @icon         ${icon}`);
  lines.push(
    ...metadataLines(meta, 'include'),
    ...metadataLines(meta, 'exclude'),
    ...metadataLines(meta, 'grant'),
    ...metadataLines(meta, 'require'),
    ...metadataLines(meta, 'resource'),
    ...metadataLines(meta, 'connect')
  );

  for (const key of PASSTHROUGH_META_KEYS)
    lines.push(...metadataLines(meta, key));
  for (const key of Object.keys(meta)
    .filter(
      (key) =>
        !MULTI_META_KEYS.has(key) &&
        !PASSTHROUGH_META_KEYS.includes(key as never) &&
        key !== 'icon'
    )
    .sort()) {
    lines.push(...metadataLines(meta, key));
  }

  lines.push(
    `// @homepage     ${repoPath}`,
    `// @homepageURL  ${repoPath}`,
    `// @supportURL   ${SUPPORT_URL}`,
    '// @license      MIT',
    `// @downloadURL  ${rawPath}`,
    `// @updateURL    ${rawPath}`,
    '// ==/UserScript==',
    '',
    code.trimEnd(),
    ''
  );

  return {
    slug,
    name,
    userscriptText: lines.join('\n'),
    description,
    keywords
  };
}

async function updateDocsIndex(
  indexPath: string,
  name: string,
  description: string,
  keywords: string[]
) {
  const text = await readText(indexPath);
  const markerIndex = text.indexOf(AUTOMATED_COMMENT);
  if (markerIndex === -1)
    throw new UserscriptError(
      `Could not find docs insertion marker in ${indexPath}.`
    );
  if (text.includes(`<userscript-card name="${name}"`)) return;

  const before = text.slice(0, markerIndex);
  const after = text.slice(markerIndex + AUTOMATED_COMMENT.length);
  const indent = before.split(/\r?\n/).at(-1) ?? '';
  const keywordText = keywords.join(' ');
  const card =
    `<userscript-card name="${name}" keywords="${keywordText}">\n` +
    `${indent}  ${description}\n` +
    `${indent}</userscript-card>\n` +
    indent;
  await Bun.write(indexPath, before + card + AUTOMATED_COMMENT + after);
}

async function main(): Promise<void> {
  const args = parseArgs();
  const repo = path.resolve(args.repo);
  const spec = await loadSpec(args);
  const { slug, name, userscriptText, description, keywords } =
    renderUserscript(spec);

  const scriptDir = path.join(repo, slug);
  const scriptPath = path.join(scriptDir, `${slug}.user.js`);
  const readmePath = path.join(scriptDir, 'README.md');
  const docsIndex = path.join(repo, 'docs', 'index.html');
  const planned = [scriptPath, readmePath, docsIndex];

  if (args.dryRun) {
    console.log(planned.join('\n'));
    return;
  }

  await mkdir(scriptDir, { recursive: true });
  await Bun.write(scriptPath, userscriptText);
  await Bun.write(readmePath, `# ${name}\n\n${description}\n`);
  await updateDocsIndex(docsIndex, name, description, keywords);
  console.log(planned.join('\n'));
}

try {
  await main();
} catch (error) {
  if (error instanceof UserscriptError) {
    console.error(`create_userscript.ts: ${error.message}`);
    process.exit(2);
  }
  throw error;
}
