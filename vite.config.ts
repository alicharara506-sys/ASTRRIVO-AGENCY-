import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// ASTRIVO is a static agency site. Native Node preview avoids a Worker runtime
// and the same export can be served by any static host.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
  server: { host: '127.0.0.1', strictPort: true },
});
