// usage: node scripts/patch-base.js <distDir> <basePath>
// example: node scripts/patch-base.js dist /rn-sudoku
const fs = require('fs');
const path = require('path');

const dist = process.argv[2] || 'dist';
let base = process.argv[3] || '/';

// normaliza: sin barra final, excepto si es "/"
if (base !== '/' && base.endsWith('/')) base = base.slice(0, -1);

const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error(`No existe ${indexPath}`);
    process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
// elimina <base> previos si los hay
html = html.replace(/<base[^>]*>/gi, '');
// inserta <base> inmediatamente después de <head>
html = html.replace('<head>', `<head><base href="${base}/">`);

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`✅ Inyectado <base href="${base}/"> en ${indexPath}`);
