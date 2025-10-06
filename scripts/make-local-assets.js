// scripts/make-local-assets.js
const fs = require('fs');
const path = require('path');

const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4N9uUAAAAASUVORK5YII=';
const outDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = [
    ['icon.local.png', b64],
    ['splash.local.png', b64],
    ['favicon.local.png', b64],
];

for (const [name, data] of files) {
    const p = path.join(outDir, name);
    fs.writeFileSync(p, Buffer.from(data, 'base64'));
    console.log('✔️  escrito', p);
}
