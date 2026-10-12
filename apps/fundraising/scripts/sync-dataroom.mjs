// Copies the investor data room (docs/dataroom, top-level files only) into
// content/dataroom so the Next build can trace and serve it from /dataroom.
// The property24/ sub-folder holds third-party contract documents and stays
// out. Runs before `next dev` and `next build`; the copy is gitignored.
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, '../../../docs/dataroom');
const dest = path.resolve(here, '../content/dataroom');

if (!existsSync(src)) {
  console.error(`[dataroom] source folder missing: ${src}`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

let copied = 0;
for (const name of readdirSync(src)) {
  const from = path.join(src, name);
  if (!statSync(from).isFile()) continue;
  cpSync(from, path.join(dest, name));
  copied += 1;
}
console.log(`[dataroom] copied ${copied} files to content/dataroom`);
