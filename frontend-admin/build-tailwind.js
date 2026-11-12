const postcss = require('./node_modules/postcss');
const tailwindcss = require('./node_modules/tailwindcss');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8');
postcss([
  tailwindcss(path.join(__dirname, 'tailwind.config.js'))
])
  .process(css, { from: path.join(__dirname, 'src/index.css'), to: path.join(__dirname, 'src/tailwind.css') })
  .then(result => {
    fs.writeFileSync(path.join(__dirname, 'src/tailwind.css'), result.css);
    console.log('TAILWIND_BUILD_SUCCESS! Size:', result.css.length, 'bytes');
  })
  .catch(err => {
    console.error('TAILWIND_BUILD_ERROR:', err);
  });
