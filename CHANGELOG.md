# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-04-21

### Added
- **New color theme migration**: Migrated to comprehensive dark/light color palette with Tailwind-inspired design tokens
  - Dark mode as default (forest green palette: #05170b background)
  - Light mode available on-demand (warm sanctuary palette: #faf8f5 background)
  - 30+ organized CSS custom properties (surfaces, colors, text roles, utilities)
  - Primary color: Mint (#69dbad dark, #007a58 light)
  - Secondary color: Orange (#ffb691 dark, #a94500 light)
  
- **Astro 6 Fonts API integration**: Configured system fonts via Fonts API
  - Added Manrope font for display headings (via Fontsource)
  - Added Inter font for body text (via Fontsource)
  - Maintained Atkinson font as fallback
  - All fonts auto-optimized by Astro with preload links

- **Dark/Light mode toggle infrastructure**: Prepared for future user theme selection
  - Class-based theme toggle system (`.light` class on `<html>`)
  - localStorage persistence for user preferences ('dark', 'light', 'system')
  - Inline theme initialization script prevents flash of unstyled content
  - Supports three modes:
    1. **dark** (default): Always dark theme
    2. **light**: Always light theme
    3. **system**: Respects OS preference (prefers-color-scheme)

### Changed
- Updated `src/styles/global.css`:
  - Replaced simple accent/gray color variables with comprehensive theme system
  - Organized variables by function (surface hierarchy, colors, text roles, utilities)
  - Dark mode as CSS default (no `@media (prefers-color-scheme)` automatic switching)
  - Light mode only applied via explicit `.light` class or 'light'/'system' localStorage
  - Updated base styles (body, headings, links, code) to use new color variables
  - Added `.glass-panel` utility and icon size helpers

- Updated `astro.config.mjs`:
  - Added Fontsource providers for Manrope and Inter fonts
  - Fonts automatically cached and optimized by Astro 6

- Updated `src/components/BaseHead.astro`:
  - Added inline theme initialization script (is:inline for early execution)
  - No flash of unstyled content on page load

### Created
- `src/scripts/theme.js`: Theme management utilities
  - `initTheme()`: Apply saved or default theme on page load
  - `setTheme(theme)`: Set theme to 'dark', 'light', or 'system'
  - `toggleTheme()`: Toggle between dark and light
  - `getCurrentTheme()`: Get current theme preference
  - Supports localStorage persistence

### Maintained
- All layout and spacing unchanged (720px main container, responsive breakpoints)
- All existing pages and blog content remain fully functional
- Backward compatibility with legacy color variable names (--accent, --color-mint, --color-orange)
- Typography hierarchy and sizing unchanged (h1-h6 scale)
- Lighthouse 100/100 target maintained

### Testing
- Validated with Playwright:
  - ✅ Dark mode renders correctly with proper contrast
  - ✅ Light mode renders correctly with proper contrast
  - ✅ Theme persistence via localStorage works
  - ✅ All pages (home, blog, about, blog posts) render without breakages
  - ✅ Typography readable in both themes
  - ✅ Links (mint color) visible and accessible
  - ✅ No visual regressions

### Technical Details
- **Default theme**: Dark (forest green, #05170b)
- **System preference detection**: Only applied when explicitly saved as 'system' preference
- **CSS organization**: Variables grouped by function for future Tailwind migration
- **Font loading**: Optimized via Astro 6 Fonts API (auto-preload, caching, fallbacks)
- **Theme script**: Inline and non-blocking to prevent flash of unstyled content

### Next Steps (Future)
- Implement user-facing theme toggle component (ThemeToggle.astro)
- Add theme selection UI (dark/light/system buttons)
- Migrate remaining styling to Tailwind CSS when ready
- Expand typography scale with new font families

---

## Initial Release - Astro 6.1.8 Blog Starter
- Minimal styling baseline from Bear Blog theme
- MDX and sitemap integrations configured
- RSS feed generation
- Content collections for blog posts
