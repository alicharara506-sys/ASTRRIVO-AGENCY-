import fs from 'node:fs';
import path from 'node:path';

const publicOutput = 'dist/client';
if (!fs.existsSync(path.join(publicOutput, 'index.html'))) throw new Error('Static homepage was not generated.');

// A crawling policy with no invented domain. Configure a verified canonical
// origin in site-config.ts before adding an absolute sitemap URL.
fs.writeFileSync(path.join(publicOutput, 'robots.txt'), 'User-agent: *\nAllow: /\n');

// The build emits routes as `contact.html`. Some static hosts serve clean URLs
// from that, others only from `contact/index.html` — emit both so `/contact`
// resolves wherever this is deployed.
const mirrored = [];
for (const entry of fs.readdirSync(publicOutput, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const route = entry.name.slice(0, -'.html'.length);
  if (route === 'index' || route === '404') continue;

  const directory = path.join(publicOutput, route);
  fs.mkdirSync(directory, { recursive: true });
  fs.copyFileSync(path.join(publicOutput, entry.name), path.join(directory, 'index.html'));
  mirrored.push(route);
}

const routes = mirrored.length ? ` Mirrored routes: ${mirrored.map((route) => `/${route}`).join(', ')}.` : '';
console.log(`Verified static homepage and wrote robots.txt. Public output: ${publicOutput}.${routes}`);
