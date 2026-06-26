import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const maxFileSizeBytes = 1024 * 1024;

const scanTargets = [
  'README.md',
  'README.zh-CN.md',
  'docs',
  'app',
  'components',
  'lib',
  'features',
  'database',
  'content',
  'scripts',
  'package.json',
  '.env.example',
];

const excludedDirectories = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'coverage',
]);

const excludedFileNames = new Set([
  '.env',
  '.env.local',
  '.env.production',
]);

const excludedExtensions = new Set([
  '.bak',
  '.backup',
  '.bin',
  '.bmp',
  '.dump',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
  '.tar',
  '.tgz',
  '.webp',
  '.zip',
]);

const sensitiveTerms = [
  ['PERSONAL_SITE_DATABASE_URL=', 'postgres://'],
  ['ADMIN_', 'PASSWORD_HASH='],
  ['ADMIN_', 'SESSION_SECRET='],
  ['password', '='],
  ['secret', '='],
  ['token', '='],
  ['api_', 'key='],
].map((parts) => parts.join(''));

const adminPasswordHashTerm = ['ADMIN_', 'PASSWORD_HASH='].join('');
const adminSessionSecretTerm = ['ADMIN_', 'SESSION_SECRET='].join('');
const postgresDatabaseUrlTerm = ['PERSONAL_SITE_DATABASE_URL=', 'postgres://'].join('');
const lowSignalAssignmentTerms = [
  ['password', '='].join(''),
  ['secret', '='].join(''),
  ['token', '='].join(''),
  ['api_', 'key='].join(''),
];

const allowedReadmeOnlyTerms = new Set([
  ['oli', '6666.top'].join(''),
]);

function toProjectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join('/');
}

function shouldSkipPath(entryPath, dirent) {
  const name = dirent.name;

  if (dirent.isDirectory()) {
    return excludedDirectories.has(name);
  }

  if (excludedFileNames.has(name)) {
    return true;
  }

  const lowerName = name.toLowerCase();
  const extension = path.extname(lowerName);

  if (excludedExtensions.has(extension)) {
    return true;
  }

  return (
    lowerName.includes('backup') ||
    lowerName.includes('dump') ||
    lowerName.endsWith('.min.js') ||
    lowerName.endsWith('.map')
  );
}

function walk(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return [];
  }

  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    return [targetPath];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(targetPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(targetPath, entry.name);

    if (shouldSkipPath(entryPath, entry)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function isReadme(projectPath) {
  return projectPath === 'README.md' || projectPath === 'README.zh-CN.md';
}

function isAllowedEnvPlaceholder(projectPath, line, term) {
  if (
    term === adminPasswordHashTerm ||
    term === adminSessionSecretTerm
  ) {
    if (projectPath === 'scripts/generate-admin-secrets.mjs') {
      return true;
    }

    return /^ADMIN_(PASSWORD_HASH|SESSION_SECRET)=(<[^>]+>)?\s*$/.test(line.trim());
  }

  if (term === postgresDatabaseUrlTerm) {
    return line.includes('postgres://...');
  }

  return false;
}

function isAllowedLowSignalPattern(line, term) {
  const trimmed = line.trim();

  if (
    lowSignalAssignmentTerms.includes(term) &&
    (trimmed.startsWith('//') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('- ') ||
      trimmed.includes('<') ||
      trimmed.endsWith('=') ||
      trimmed.includes('process.env') ||
      trimmed.includes('searchParams') ||
      trimmed.includes('URLSearchParams'))
  ) {
    return true;
  }

  return false;
}

function isAllowedHit(projectPath, line, term) {
  if (allowedReadmeOnlyTerms.has(term) && isReadme(projectPath)) {
    return true;
  }

  if (isAllowedEnvPlaceholder(projectPath, line, term)) {
    return true;
  }

  if (isAllowedLowSignalPattern(line, term)) {
    return true;
  }

  return false;
}

function scanFile(filePath) {
  const projectPath = toProjectPath(filePath);

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return [];
  }

  if (stat.size > maxFileSizeBytes) {
    return [];
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  if (content.includes('\u0000')) {
    return [];
  }

  const hits = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const term of sensitiveTerms) {
      if (!line.includes(term)) {
        continue;
      }

      if (isAllowedHit(projectPath, line, term)) {
        continue;
      }

      hits.push({
        projectPath,
        lineNumber: index + 1,
        term,
      });
    }

    for (const term of allowedReadmeOnlyTerms) {
      if (!line.includes(term)) {
        continue;
      }

      if (isReadme(projectPath)) {
        continue;
      }

      hits.push({
        projectPath,
        lineNumber: index + 1,
        term,
      });
    }
  });

  return hits;
}

const files = scanTargets.flatMap((target) => walk(path.join(projectRoot, target)));
const uniqueFiles = [...new Set(files)];
const hits = uniqueFiles.flatMap(scanFile);

if (hits.length > 0) {
  console.error('Public release security scan failed.');
  console.error('Sensitive or private release terms were found:');

  for (const hit of hits) {
    console.error(`- ${hit.projectPath}:${hit.lineNumber} matched "${hit.term}"`);
  }

  process.exit(1);
}

console.log(`Public release security scan passed. Scanned ${uniqueFiles.length} files.`);
process.exit(0);
