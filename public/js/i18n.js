// ponytail: minimal i18n — no framework, just localStorage + JSON fetch + DOM swap
// ceiling: all translations loaded at once per page (fine for <500 keys); upgrade to lazy-load per section if pages grow huge

(function() {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'af', 'zu'];
  const LANG_LABELS = { en: 'English', af: 'Afrikaans', zu: 'isiZulu' };
  const STORAGE_KEY = 'preferred-lang';

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = 'en';

  let translations = {};

  // Public API
  window.i18n = {
    t,
    lang: () => currentLang,
    setLang,
    load,
    translatePage
  };

  function t(key, fallback) {
    return (translations[currentLang] && translations[currentLang][key])
      || (translations.en && translations.en[key])
      || fallback
      || key;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    translatePage();
    // Update switcher UI
    const sel = document.getElementById('lang-switcher-select');
    if (sel) sel.value = lang;
  }

  function load(translationObj) {
    // translationObj = { en: {...}, af: {...}, zu: {...} }
    translations = translationObj;
    translatePage();
  }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.innerHTML = val;
        }
      }
    });
    document.documentElement.lang = currentLang;
  }

  // Inject language switcher into page
  function injectSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'lang-switcher';
    switcher.innerHTML = `
      <select id="lang-switcher-select" aria-label="Select language">
        ${SUPPORTED_LANGS.map(l => `<option value="${l}" ${l === currentLang ? 'selected' : ''}>${LANG_LABELS[l]}</option>`).join('')}
      </select>
    `;
    document.body.appendChild(switcher);
    document.getElementById('lang-switcher-select').addEventListener('change', e => {
      setLang(e.target.value);
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSwitcher);
  } else {
    injectSwitcher();
  }
})();
