import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcCss = path.join(rootDir, 'src', 'app', 'globals.css');
const distDir = path.join(rootDir, 'dist');
const distCss = path.join(distDir, 'styles.css');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.copyFileSync(srcCss, distCss);
console.log('✓ Successfully copied src/app/globals.css -> dist/styles.css');
