import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const publicDir = join(projectRoot, 'public');

const DEV_URL = 'http://localhost:4321';

async function generateScreenshots() {
  console.log('Starting PWA screenshot generation...');

  const browser = await chromium.launch();

  try {
    // Narrow screenshot (540x720 - mobile)
    console.log('Generating narrow screenshot (540x720)...');
    const narrowPage = await browser.newPage({
      viewport: { width: 540, height: 720 }
    });
    await narrowPage.goto(DEV_URL, { waitUntil: 'networkidle' });
    await narrowPage.screenshot({
      path: join(publicDir, 'pwa-screenshot-narrow.png'),
      fullPage: false
    });
    console.log('✓ Narrow screenshot saved: /pwa-screenshot-narrow.png');
    await narrowPage.close();

    // Wide screenshot (1280x720 - desktop/tablet)
    console.log('Generating wide screenshot (1280x720)...');
    const widePage = await browser.newPage({
      viewport: { width: 1280, height: 720 }
    });
    await widePage.goto(DEV_URL, { waitUntil: 'networkidle' });
    await widePage.screenshot({
      path: join(publicDir, 'pwa-screenshot-wide.png'),
      fullPage: false
    });
    console.log('✓ Wide screenshot saved: /pwa-screenshot-wide.png');
    await widePage.close();

    console.log('\n✓ All screenshots generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Review screenshots at public/pwa-screenshot-narrow.png and public/pwa-screenshot-wide.png');
    console.log('2. Update site.webmanifest with new screenshot entries');

  } catch (error) {
    console.error('Error generating screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generateScreenshots();
