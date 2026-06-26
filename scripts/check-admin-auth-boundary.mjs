import fs from 'node:fs';
import path from 'node:path';

const adminDir = path.join(process.cwd(), 'app', 'admin');
const publicEntries = new Set(['app/admin/login/page.tsx']);

function isEntryFile(filePath) {
  const fileName = path.basename(filePath);
  return (
    fileName === 'page.tsx' ||
    fileName === 'route.ts' ||
    fileName === 'actions.ts' ||
    fileName.endsWith('-actions.ts')
  );
}

function toProjectPath(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join('/');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
      continue;
    }

    if (entry.isFile() && isEntryFile(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

if (!fs.existsSync(adminDir)) {
  console.error('Admin auth boundary check failed: app/admin does not exist.');
  process.exit(1);
}

const riskyFiles = walk(adminDir).filter((filePath) => {
  const projectPath = toProjectPath(filePath);

  if (publicEntries.has(projectPath)) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return !content.includes('requireAdminSession');
});

if (riskyFiles.length > 0) {
  console.error('Admin auth boundary check failed.');
  console.error('The following Admin entry files may be missing requireAdminSession:');

  for (const filePath of riskyFiles) {
    console.error(`- ${toProjectPath(filePath)}`);
  }

  process.exit(1);
}

console.log('Admin auth boundary check passed');
process.exit(0);
