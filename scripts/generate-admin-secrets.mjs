import { createHash, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stderr as output } from 'node:process';

const rl = createInterface({ input, output });

let exitCode = 0;
let pipedLines;

async function readPipedLines() {
  if (pipedLines) return pipedLines;

  pipedLines = [];
  for await (const line of rl) {
    pipedLines.push(line);
  }
  if (pipedLines[0]?.startsWith('\uFEFF')) {
    pipedLines[0] = pipedLines[0].slice(1);
  }

  return pipedLines;
}

async function ask(question) {
  if (input.isTTY) {
    return rl.question(question);
  }

  const lines = await readPipedLines();
  output.write(question);

  return lines.shift() ?? '';
}

try {
  const password = await ask('Admin password: ');

  if (!password) {
    throw new Error('Admin password cannot be empty.');
  } else {
    const confirmation = await ask('Confirm Admin password: ');

    if (password !== confirmation) {
      throw new Error('Admin passwords do not match.');
    } else {
      const passwordHash = createHash('sha256').update(password, 'utf8').digest('hex');
      const sessionSecret = randomBytes(32).toString('hex');

      console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
      console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Failed to generate admin secrets.');
  exitCode = 1;
} finally {
  rl.close();
}

if (exitCode !== 0) {
  process.exit(exitCode);
}
