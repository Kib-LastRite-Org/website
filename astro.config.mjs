// @ts-check

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from 'astro/config';

/** Parse key=value lines from .env.local — used by the validate-env plugin. */
function readEnvLocal() {
  const path = resolve('.env.local');
  if (!existsSync(path)) return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = /^\s*([^#\s=][^=]*?)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    const key = m[1];
    const val = m[2];
    if (key !== undefined && val !== undefined) out[key] = val.replace(/^['"]|['"]$/g, '');
  }
  return out;
}

function makeValidateEnvPlugin() {
  /** @type {any} */
  let cfg;
  return {
    name: 'validate-env',
    /** @param {any} config */
    configResolved(config) { cfg = config; },
    configureServer() {
      const env = readEnvLocal();
      const required = [
        'CREATE_API_TOKEN', 'PUBLIC_CREATE_API_TOKEN',
        'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
      ];
      const missing = required.filter(k => !env[k]);
      if (missing.length) {
        console.warn(
          `\n\x1b[33m[lastrite]\x1b[0m Missing env vars: ${missing.join(', ')}\n` +
          `          Copy .env.example → .env.local and fill in the values.\n`,
        );
      }
    },
    buildStart() {
      if (cfg?.command !== 'build') return;
      const env = readEnvLocal();
      const required = [
        'CREATE_API_TOKEN', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
      ];
      const missing = required.filter(k => !env[k]);
      if (missing.length) {
        throw new Error(`[lastrite] Missing required env vars for build: ${missing.join(', ')}`);
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),

  site: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://website-azure-two-47.vercel.app",

  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      makeValidateEnvPlugin(),
    ],
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-sans",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/inter-latin-400-normal.woff2"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/inter-latin-600-normal.woff2"],
            weight: 600,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Manrope",
      cssVariable: "--font-display",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/manrope-latin-200-normal.woff2"],
            weight: 200,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/manrope-latin-300-normal.woff2"],
            weight: 300,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/manrope-latin-400-normal.woff2"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/manrope-latin-700-normal.woff2"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Atkinson",
      cssVariable: "--font-atkinson",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-regular.woff"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/atkinson-bold.woff"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],
});