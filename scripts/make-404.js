// usage: node scripts/make-404.js <distDir>
const fs = require('fs');
const path = require('path');

const dist = process.argv[2] || 'docs';
const indexPath = path.join(dist, 'index.html');
const f404 = path.join(dist, '404.html');

if (!fs.existsSync(indexPath)) {
    console.error(`No existe ${indexPath}`);
    process.exit(1);
}
fs.copyFileSync(indexPath, f404);
console.log(`✅ 404.html creado a partir de index.html`);
