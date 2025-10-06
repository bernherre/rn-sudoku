// node scripts/make-404.js <distDir>
const fs = require('fs');
const path = require('path');
const dist = process.argv[2] || 'dist';
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
console.log('✔️  404.html creado');
