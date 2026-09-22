const STORAGE_KEY = "theme"; 
export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
export function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
  }
  applyTheme(theme);
}
export function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);
  return theme;
}
