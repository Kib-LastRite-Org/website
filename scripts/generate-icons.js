/**
 * Generate PWA icons from favicon.svg for web app installation.
 * Creates icon-192.png and icon-512.png required by site.webmanifest.
 * Run: node scripts/generate-icons.js
 */

import sharp from 'sharp';
import fs from 'fs';

const svgPath = './public/favicon.svg';

if (!fs.existsSync(svgPath)) {
  console.error(`✗ Favicon not found: ${svgPath}`);
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);
const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

Promise.all(
  sizes.map(({ size, name }) =>
    sharp(svgBuffer)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(`./public/${name}`)
      .then(() => console.log(`✓ Generated ${name}`))
      .catch(err => {
        console.error(`✗ Error generating ${name}:`, err.message);
        process.exit(1);
      })
  )
).then(() => console.log('\n✓ All PWA icons generated successfully'));
