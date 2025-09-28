// Funções comuns: storage, helpers
const STORAGE_KEY = 'meuCMSData';

function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { pages: [], templates: [], catalogItems: [] };
}
function setData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function slugify(text) {
  return text.toString().toLowerCase().replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
function findPageBySlug(slug) {
  const data = getData();
  return data.pages.find(p => p.slug === slug);
}
