import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'dist', 'content');

await mkdir(outputDirectory, { recursive: true });
const contentFiles = await readdir(path.join(root, 'content'));
await Promise.all(contentFiles
  .filter((file) => file.endsWith('.json'))
  .map((file) => copyFile(
    path.join(root, 'content', file),
    path.join(outputDirectory, file),
  )));
