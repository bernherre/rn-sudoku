// scripts/ci-fix-assets.js
// - Genera 3 PNGs válidos temporales
// - Reescribe app.json para que icon/splash/favicon apunten a esos PNGs

const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(process.cwd(), 'app.json');
if (!fs.existsSync(appJsonPath)) {
    console.error('No existe app.json en el workspace');
    process.exit(1);
}

const b64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4N9uUAAAAASUVORK5YII=';

const tmpDir = path.join(process.cwd(), '.ci-assets');
fs.mkdirSync(tmpDir, { recursive: true });

const iconPath = path.join(tmpDir, 'icon.png');
const splashPath = path.join(tmpDir, 'splash.png');
const faviconPath = path.join(tmpDir, 'favicon.png');

for (const p of [iconPath, splashPath, faviconPath]) {
    fs.writeFileSync(p, Buffer.from(b64, 'base64'));
}

const app = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
app.expo = app.expo || {};
app.expo.icon = iconPath;
app.expo.splash = {
    image: splashPath,
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
};
app.expo.web = app.expo.web || {};
app.expo.web.favicon = faviconPath;

// bundler/web config se mantiene tal cual tengas
fs.writeFileSync(appJsonPath, JSON.stringify(app, null, 2));
console.log('✅ app.json parcheado a assets válidos temporales:', { iconPath, splashPath, faviconPath });
