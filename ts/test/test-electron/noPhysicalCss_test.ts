import { assert } from 'chai';
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '../../..');

function walk(dir: string, ext: string): Array<string> {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(entry => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'dist' || entry.name === 'node_modules' ? [] : walk(rel, ext);
    }
    return entry.name.endsWith(ext) ? [rel] : [];
  });
}

const CONVERTED = [...walk('stylesheets', '.scss'), ...walk('ts/components', '.tsx')];

const PHYSICAL = [
  /\b(margin|padding|border)-(left|right)\b/,
  /\bborder-(top|bottom)-(left|right)-radius\b/,
  /\btext-align:\s*(left|right)\b/,
  /(^|[\s;{])(left|right)\s*:/,
  /\b(margin|padding)(Left|Right)\b/,
];

describe('RTL: no physical left/right CSS', () => {
  CONVERTED.forEach(file => {
    it(file, () => {
      const offending = fs
        .readFileSync(path.join(ROOT, file), 'utf8')
        .split('\n')
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => !line.includes('rtl-ok') && !line.trim().startsWith('//'))
        .filter(({ line }) => PHYSICAL.some(re => re.test(line)));
      assert.deepEqual(
        offending.map(o => `${o.n}: ${o.line.trim()}`),
        [],
        `${file} still has physical properties`
      );
    });
  });
});
