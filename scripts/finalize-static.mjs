import fs from 'node:fs';
import path from 'node:path';

const publicOutput = 'dist/client';
if (!fs.existsSync(path.join(publicOutput, 'index.html'))) throw new Error('Static homepage was not generated.');
// A crawling policy with no invented domain. Configure a verified canonical
// origin in site-config.ts before adding an absolute sitemap URL.
fs.writeFileSync(path.join(publicOutput, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log('Verified static homepage and wrote robots.txt. Public output: dist/client');
