import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Node on Windows can abort while process.exit() tears down an active libuv
// handle. Let the successful CLI build drain normally; never swallow errors.
// Upstream: https://github.com/nodejs/node/issues/58091
if (process.platform === 'win32') {
  const packageFile = path.resolve(path.dirname(fileURLToPath(import.meta.resolve('vinext'))), '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  if (pkg.version !== '1.0.0-beta.6') throw new Error('Review the Windows CLI fix before changing Vinext versions.');
  const cli = path.join(path.dirname(packageFile), 'dist', 'cli.js');
  const source = fs.readFileSync(cli, 'utf8');
  const success = '\tprocess.exit(0);\n}\nasync function start()';
  const safeSuccess = '\tprocess.exitCode = 0; // ASTRIVO: allow Windows libuv cleanup\n}\nasync function start()';
  const failure = 'case "build":\n\t\tbuildApp().catch((e) => {\n\t\t\tconsole.error(e);\n\t\t\tprocess.exit(1);';
  const safeFailure = 'case "build":\n\t\tbuildApp().catch((e) => {\n\t\t\tconsole.error(e);\n\t\t\tprocess.exitCode = 1; // ASTRIVO: preserve failure while draining';
  if (!source.includes(safeSuccess) || !source.includes(safeFailure)) {
    if (!source.includes(success) || !source.includes(failure)) throw new Error('Vinext CLI source differs from the verified Windows fix.');
    fs.writeFileSync(cli, source.replace(success, safeSuccess).replace(failure, safeFailure));
    console.log('Applied the version-checked Windows build shutdown fix.');
  }
}
