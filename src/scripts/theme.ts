type Theme = 'light' | 'dark' | 'system';

export function initTheme() {
  const saved = localStorage.getItem('theme') as Theme | null;

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

export function setTheme(theme: Theme) {
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
  const newTheme: Theme = isDark ? 'light' : 'dark';
  setTheme(newTheme);
}

export function getCurrentTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'system') {
    return saved;
  }
  return 'dark';
}

if (typeof document !== 'undefined') {
  initTheme();
}
