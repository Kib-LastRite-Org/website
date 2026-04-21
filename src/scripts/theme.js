/**
 * Theme toggle utility
 * Manages user's theme preference: 'dark' (default), 'light', or 'system'
 * Dark mode is the default. Users can switch to light or system preference.
 */

export function initTheme() {
	// Default to dark, check for saved preference
	const saved = localStorage.getItem('theme');

	if (saved === 'light') {
		document.documentElement.classList.add('light');
	} else if (saved === 'system') {
		const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
		if (!prefersDark) {
			document.documentElement.classList.add('light');
		}
	}
	// else: dark is default, no class needed
}

export function setTheme(theme) {
	if (theme === 'light') {
		document.documentElement.classList.add('light');
		localStorage.setItem('theme', 'light');
	} else if (theme === 'system') {
		const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
		if (!prefersDark) {
			document.documentElement.classList.add('light');
		} else {
			document.documentElement.classList.remove('light');
		}
		localStorage.setItem('theme', 'system');
	} else if (theme === 'dark') {
		document.documentElement.classList.remove('light');
		localStorage.setItem('theme', 'dark');
	}
}

export function toggleTheme() {
	const isDark = !document.documentElement.classList.contains('light');
	const newTheme = isDark ? 'light' : 'dark';
	setTheme(newTheme);
}

export function getCurrentTheme() {
	const saved = localStorage.getItem('theme');
	if (saved === 'light' || saved === 'system') {
		return saved;
	}
	return 'dark';
}

// Run initialization immediately if in browser
if (typeof document !== 'undefined') {
	initTheme();
}
