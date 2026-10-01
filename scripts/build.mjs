import { cp, mkdir, rm, readdir } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
const files = await readdir('dist');
if (!files.includes('index.html') || files.some(f => f.startsWith('.env'))) throw new Error('Invalid public build.');
console.log('Built static assets in dist/. Server functions are deployed separately by Vercel or Netlify.');
