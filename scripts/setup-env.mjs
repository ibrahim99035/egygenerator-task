// Creates server/.env and client/.env from their .env.example templates.
// Existing .env files are never overwritten.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

for (const app of ['server', 'client']) {
  const example = join(root, app, '.env.example');
  const target = join(root, app, '.env');

  if (existsSync(target)) {
    console.log(`= ${app}/.env already exists - left unchanged`);
  } else if (existsSync(example)) {
    copyFileSync(example, target);
    console.log(`+ created ${app}/.env from ${app}/.env.example`);
  } else {
    console.warn(`! ${app}/.env.example not found - skipped`);
  }
}

console.log('\nReview the values in both .env files before running "npm run dev".');
