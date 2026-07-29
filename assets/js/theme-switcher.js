(function () {
  const storageKey = 'mysql-guide-theme';
  const attr = 'data-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(storageKey);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute(attr, theme);
    localStorage.setItem(storageKey, theme);
  }

  const theme = getPreferredTheme();
  setTheme(theme);

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const sunIcon = '<i class="bi bi-sun-fill"></i>';
    const moonIcon = '<i class="bi bi-moon-fill"></i>';

    function updateIcon() {
      const current = document.documentElement.getAttribute(attr);
      toggle.innerHTML = current === 'dark' ? sunIcon : moonIcon;
    }

    updateIcon();

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute(attr);
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      updateIcon();
    });
  });
})();
