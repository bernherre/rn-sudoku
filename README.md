# rn-sudoku

Sudoku hecho con React Native + Expo (web).
Se publica en GitHub Pages con PWA habilitado.

--Producción: https://bernherre.github.io/rn-sudoku/

--Previews por rama: https://bernherre.github.io/rn-sudoku/preview/<rama>/

# Tech

React 18.2

React Native 0.74 / react-native-web 0.19

Expo ~51 (bundler web: Metro)

PWA (manifest + service worker)

## CI/CD con GitHub Actions (deploy a gh-pages)

# 🧩 RN Sudoku (React Native + Web, Expo, TypeScript)

Sudoku multiplataforma (iOS, Android y Web con Expo) con tableros **4×4** y **6×6**, niveles de dificultad, cronómetro y validación de errores.

# autor @bernherre
---

## 🚀 Características

- ✅ Generador de tableros con solución única.
- 🎚️ Dificultades: *easy*, *medium*, *hard*, *expert*.
- ⏱️ Cronómetro con pausa/reanudar.
- 🧮 Verificación de errores (celdas incorrectas resaltadas).
- 🖱️ Interacción táctil + atajos de teclado (1–6, Backspace, flechas).
- 🌙 Tema oscuro (base, fácil de extender a claro).
- 📱 Multiplataforma: Android, iOS y Web (con soporte PWA).
- 🧪 Tests con Jest + Testing Library.
- ⚙️ CI con GitHub Actions (lint + tests).
- 📄 Despliegue en **GitHub Pages**.

---

## 📦 Instalación

-```bash
# instalar dependencias
npm install

# iniciar en modo Expo
npm run start

# lanzar en web
npm run web:build 
npm run ios:build
npm run android:build

# ejecutar con cache limpio
npx expo start -c .

# Vista previa local de build

npx serve dist -p 3000





# utils https://github.com/gitname/react-gh-pagesnpm 


# CI/CD (GitHub Actions)

Este repo incluye dos workflows en .github/workflows/:

## ci.yml — Todas las ramas y pull requests

Instala deps

Genera assets válidos (íconos/splash) y un app.json solo para CI

Activa PWA

Prefiere Sharp (evita CRC de Jimp)

Reescribe rutas absolutas (/_expo/*, /manifest.json, /sw.js) al subpath

Sube dist/ como artefacto

## pages.yml — Deploy a gh-pages en cualquier rama

Rama main → publica en la raíz del sitio: /rn-sudoku/

Otras ramas → publica como preview en /rn-sudoku/preview/<rama>/

Mantiene PWA y reescritura de rutas

Deja un 404.html para fallback (SPA)

# URLs de deploy

- Prod (main): https://bernherre.github.io/rn-sudoku/

- Preview (ej. rama feature/x):
- https://bernherre.github.io/rn-sudoku/preview/feature/x/

Si en el nombre de la rama hay /, GitHub Pages creará subcarpetas (válido).

# Requisitos de Pages

En Settings → Pages:

Source: Deploy from a branch

Branch: gh-pages (root)

Desarrollo local
# Requisitos
node 20.x
npm ci

# Correr
npm start        # y presiona "w" para abrir en web
# o
npm run web


Para probar el build estático:
  
npm run build:web
npx serve dist -p 3000


- Si ves rutas 404 en local por el subpath, recuerda que el build exporta con publicPath: "/rn-sudoku/". En local, el server debe servir dist/ como raíz o ajustar base.

Troubleshooting
## 1) Crc error ... jimp-compact en CI

### Causas típicas:

- PNGs corruptos o punteros de Git LFS en vez de binarios.

- Generación de variantes de íconos con Jimp.

### Soluciones aplicadas en los workflows:

- Checkout con LFS: actions/checkout@v4 con lfs: true.

- Sharp como backend (npm i -D sharp sharp-cli).

- Assets de CI válidos (se generan íconos/splash limpios en el job).

- Sincronización de app.json: el CI escribe un app.json mínimo y consistente.

## 2) 404 de scripts /_expo/*

- Es por rutas absolutas en HTML/JS (e.g. src="/_expo/...) que en Pages apuntan a la raíz del dominio.

- El workflow reescribe todo dist/ para anteponer el subpath /rn-sudoku/ a esas rutas (/_expo/*, manifest.json, sw.js) y también inyecta <link rel="icon"> y <link rel="manifest"> con el subpath correcto.

## 3) favicon.ico 404

- El navegador busca /<favicon.ico> en la raíz del dominio si no hay <link rel="icon">.

- El CI copia favicon.ico dentro de dist/ y inyecta <link rel="icon" href="/rn-sudoku/favicon.ico"> en index.html (y 404.html).

## 4) Cache del SW (PWA)

-. Si cambias cosas y no se ven en producción, puede ser cache del service worker.

-. Haz hard reload o unregister el SW en DevTools → Application → Service Workers.

-.Los workflows está activado pwa: true; si quieres desactivarlo temporalmente, pon "pwa": false en app.json (solo para probar).

# Convenciones

- No definas icon/web/splash en package.json. Usa app.json para Expo.

- Mantén publicPath con el subpath del proyecto en Pages (/rn-sudoku/).

- Los workflows parchean rutas y manifiesto automáticamente; evita mezclar otros scripts de deploy (ej. gh-pages CLI) para no duplicar.

# Licencia

MIT — haz puzzles y comparte ✨