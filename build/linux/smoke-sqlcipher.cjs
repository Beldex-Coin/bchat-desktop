// Opens encrypted SQLCipher databases through @signalapp/sqlcipher and exercises the Rust crypto
// provider and FTS5 tokenizer. Run with node or ELECTRON_RUN_AS_NODE=1 electron:
//   smoke-sqlcipher.cjs <path/to/node_modules/@signalapp/sqlcipher> [existing-dir]
// Covers both ways the app keys its database (ts/node/sql.ts keyDatabase): the default hex key
// as a raw key (raw.db) and a user-set password through key derivation (passphrase.db).
// Without existing-dir it creates both in a temp dir; with it, it only reads them (checks that
// databases written by another build still open).
const fs = require('fs');
const os = require('os');
const path = require('path');

const mod = require(process.argv[2]);
const Database = mod.default || mod;
const dir = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'sqlc-'));
const KEYS = {
  'raw.db': "key = \"x'00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff'\"",
  'passphrase.db': "key = 'correct horse battery staple'",
};

let cipher;
for (const [name, key] of Object.entries(KEYS)) {
  const file = path.join(dir, name);
  if (!process.argv[3]) {
    const w = new Database(file);
    w.pragma(key);
    w.exec('CREATE TABLE t (v TEXT)');
    w.prepare('INSERT INTO t (v) VALUES ($v)').run({ v: 'hello' });
    w.close();
  }

  const r = new Database(file);
  r.pragma(key);
  const v = r.prepare('SELECT v FROM t').get().v;
  cipher = r.pragma('cipher_version', { simple: true });
  const tokens = r.signalTokenize('a b c').join(',');
  r.close();

  if (v !== 'hello' || !cipher || tokens !== 'a,b,c') {
    throw new Error(`${name}: bad result v=${v} cipher=${cipher} tokens=${tokens}`);
  }
  if (fs.readFileSync(file).subarray(0, 15).toString() === 'SQLite format 3') {
    throw new Error(`${name}: database is not encrypted`);
  }
}
console.log(`sqlcipher ok (cipher ${cipher}) ${dir}`);
