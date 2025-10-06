// scripts/ci-make-config.js
// Genera PNGs válidos temporales y escribe app.ci.json para el export web en CI.

const fs = require('fs');
const path = require('path');

const ciDir = path.join(process.cwd(), '.ci-assets');
fs.mkdirSync(ciDir, { recursive: true });

const b64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4N9uUAAAAASUVORK5YII=';

const icon = path.join(ciDir, 'icon.png');
const splash = path.join(ciDir, 'splash.png');
const favicon = path.join(ciDir, 'favicon.png');

for (const p of [icon, splash, favicon]) {
    fs.writeFileSync(p, Buffer.from(b64, 'base64'));
}

const appCi = {
    expo: {
        name: 'rn-sudoku (CI)',
        slug: 'rn-sudoku-ci',
        platforms: ['web'], // sólo necesitamos web para exportar
        icon,
        splash: {
            image: splash,
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        web: {
            bundler: 'metro',
            favicon,
        },
    },
};

fs.writeFileSync(
    path.join(process.cwd(), 'app.ci.json'),
    JSON.stringify(appCi, null, 2),
    'utf8'
);

console.log('✅ app.ci.json generado con assets temporales:', { icon, splash, favicon });
