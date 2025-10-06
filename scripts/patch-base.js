// usage: node scripts/patch-base.js <distDir> <basePath>
const fs = require('fs');
const path = require('path');

const dist = process.argv[2] || 'docs';
let base = process.argv[3] || '/';
if (base !== '/' && base.endsWith('/')) base = base.slice(0, -1);

const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error(`No existe ${indexPath}`);
    process.exit(1);
}
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/<base[^>]*>/gi, '');      // limpia bases anteriores
html = html.replace('<head>', `<head><base href="${base}/">`);
fs.writeFileSync(indexPath, html, 'utf8');
console.log(`✅ <base href="${base}/"> inyectado en ${indexPath}`);
