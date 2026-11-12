let postcss, tailwindcss;
try {
  postcss = require('postcss');
} catch (e) {
  postcss = require('./node_modules/postcss');
}

try {
  tailwindcss = require('tailwindcss');
} catch (e) {
  tailwindcss = require('./node_modules/tailwindcss');
}

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/index.css');
const outPath = path.join(__dirname, 'src/tailwind.css');
const configPath = path.join(__dirname, 'tailwind.config.js');

if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  postcss([
    tailwindcss(configPath)
  ])
    .process(css, { from: cssPath, to: outPath })
    .then(result => {
      fs.writeFileSync(outPath, result.css);
      console.log('TAILWIND_BUILD_SUCCESS! Size:', result.css.length, 'bytes');
    })
    .catch(err => {
      console.error('TAILWIND_BUILD_ERROR:', err);
    });
} else {
  console.warn('src/index.css not found, skipping tailwind build');
}
