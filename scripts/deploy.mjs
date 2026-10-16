// Publishes dist/ to the gh-pages branch of this repository's "origin" remote.
// Usage: npm run deploy   (runs the production build first)
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const origin = execSync('git remote get-url origin').toString().trim();
if (!existsSync('dist/index.html')) throw new Error('dist/ is missing: run npm run build first');

writeFileSync('dist/.nojekyll', '');
run('git init -q', 'dist');
run('git checkout -q -B gh-pages', 'dist');
run('git add -A', 'dist');
run('git commit -q -m "Deploy Game Zone"', 'dist');
run(`git push -f ${origin} gh-pages`, 'dist');
console.log('\nPublished to the gh-pages branch of', origin);
