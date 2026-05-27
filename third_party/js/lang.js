let translations = {};

function getNestedValue(obj, key) {
  return String(key || '').split('.').reduce((current, part) => current?.[part], obj);
}

async function loadLanguage(lang = 'en') {
  const safeLang = ['en', 'pl', 'es'].includes(lang) ? lang : 'en';
  try {
    const res = await fetch(`lang/${safeLang}.json`);
    if (!res.ok) throw new Error('Language file not found');
    translations = await res.json();
    document.documentElement.lang = safeLang;
    applyTranslations();
  } catch (e) {
    console.error('Error loading language file:', e);
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = getNestedValue(translations, el.dataset.i18n);
    if (value) el.innerText = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const value = getNestedValue(translations, el.dataset.i18nHtml);
    if (value) el.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const value = getNestedValue(translations, el.dataset.i18nPlaceholder);
    if (value) el.setAttribute('placeholder', value);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const value = getNestedValue(translations, el.dataset.i18nTitle);
    if (value) el.setAttribute('title', value);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const selectedLang = ['en', 'pl', 'es'].includes(localStorage.getItem('lang')) ? localStorage.getItem('lang') : 'en';
  const switcher = document.getElementById('lang-switch');
  if (switcher) switcher.value = selectedLang;
  loadLanguage(selectedLang);

  if (switcher) {
    switcher.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem('lang', lang);
      loadLanguage(lang);
    });
  }
});

function t(key) {
  return getNestedValue(translations, key) || key;
}
