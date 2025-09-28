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

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('page-image').value = e.target.result; // salva base64 no input hidden
      const preview = document.getElementById('preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
}


//SAVE IMG 


document.getElementById('addItemForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const imageUrl = document.getElementById('imageUrl').value;
  const imageFile = document.getElementById('imageFile').files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
      salvarNoStorage(title, description, event.target.result); // Base64
    };
    reader.readAsDataURL(imageFile);
  } else {
    salvarNoStorage(title, description, imageUrl); // Link direto
  }
});

function salvarNoStorage(title, description, image) {
  const data = JSON.parse(localStorage.getItem('meuCMSData') || '{"catalogItems":[]}');
  data.catalogItems.push({ title, description, image });
  localStorage.setItem('meuCMSData', JSON.stringify(data));
  alert("Item salvo!");
}
