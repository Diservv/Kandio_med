// Garantir escopo global das funções do admin e catálogo
window.editCatalogItem = editCatalogItem;
window.deleteCatalogItem = deleteCatalogItem;
window.saveEditCatalogItem = saveEditCatalogItem;
window.showCreateCatalogItem = showCreateCatalogItem;
window.saveNewCatalogItem = saveNewCatalogItem;
window.adminInit = adminInit;
window.logout = logout;
window.exportData = exportData;
window.importData = importData;
window.showChangePassword = showChangePassword;
window.changePassword = changePassword;
// Garantir escopo global das funções do admin e catálogo
// Lógica do admin (CRUD, export/import)
// Garantir escopo global dos métodos após definição
// ...existing code...
// No final do arquivo, garantir escopo global dos métodos
window.editCatalogItem = editCatalogItem;
window.deleteCatalogItem = deleteCatalogItem;
window.saveEditCatalogItem = saveEditCatalogItem;
window.showCreateCatalogItem = showCreateCatalogItem;
window.saveNewCatalogItem = saveNewCatalogItem;
const ADMIN_PASSWORD_KEY = 'meuCMSAdminHash';
const DEFAULT_HASH = 'e3afed0047b08059d0fada10f400c1e5'; // md5('admin123')
let loginAttempts = 0;

function getAdminHash() {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_HASH;
}
function setAdminHash(hash) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, hash);
}
function md5(str) {
  // Pequeno hash MD5 JS (não seguro para produção real, mas melhor que texto puro)
  // Fonte: https://stackoverflow.com/a/16515203
  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX, lY) {
    let lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return (x ^ y ^ z); }
  function I(x, y, z) { return (y ^ (x | (~z))); }
  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(str) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue) {
    let wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue += wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  }
  let x = [], k, AA, BB, CC, DD, a, b, c, d;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  str = unescape(encodeURIComponent(str));
  x = convertToWordArray(str);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    a = FF(a, b, c, d, x[k + 1], S12, 0xE8C7B756);
    a = FF(a, b, c, d, x[k + 2], S13, 0x242070DB);
    a = FF(a, b, c, d, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    a = FF(a, b, c, d, x[k + 5], S12, 0x4787C62A);
    a = FF(a, b, c, d, x[k + 6], S13, 0xA8304613);
    a = FF(a, b, c, d, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    a = FF(a, b, c, d, x[k + 9], S12, 0x8B44F7AF);
    a = FF(a, b, c, d, x[k + 10], S13, 0xFFFF5BB1);
    a = FF(a, b, c, d, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    a = FF(a, b, c, d, x[k + 13], S12, 0xFD987193);
    a = FF(a, b, c, d, x[k + 14], S13, 0xA679438E);
    a = FF(a, b, c, d, x[k + 15], S14, 0x49B40821);
    b = GG(b, a, c, d, x[k + 1], S21, 0xF61E2562);
    b = GG(b, a, c, d, x[k + 6], S22, 0xC040B340);
    b = GG(b, a, c, d, x[k + 11], S23, 0x265E5A51);
    b = GG(b, a, c, d, x[k + 0], S24, 0xE9B6C7AA);
    b = GG(b, a, c, d, x[k + 5], S21, 0xD62F105D);
    b = GG(b, a, c, d, x[k + 10], S22, 0x02441453);
    b = GG(b, a, c, d, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, a, c, d, x[k + 4], S24, 0xE7D3FBC8);
    b = GG(b, a, c, d, x[k + 9], S21, 0x21E1CDE6);
    b = GG(b, a, c, d, x[k + 14], S22, 0xC33707D6);
    b = GG(b, a, c, d, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, a, c, d, x[k + 8], S24, 0x455A14ED);
    b = GG(b, a, c, d, x[k + 13], S21, 0xA9E3E905);
    b = GG(b, a, c, d, x[k + 2], S22, 0xFCEFA3F8);
    b = GG(b, a, c, d, x[k + 7], S23, 0x676F02D9);
    c = HH(c, b, a, d, x[k + 5], S31, 0xFFFA3942);
    c = HH(c, b, a, d, x[k + 8], S32, 0x8771F681);
    c = HH(c, b, a, d, x[k + 11], S33, 0x6D9D6122);
    c = HH(c, b, a, d, x[k + 14], S34, 0xFDE5380C);
    c = HH(c, b, a, d, x[k + 1], S31, 0xA4BEEA44);
    c = HH(c, b, a, d, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, b, a, d, x[k + 7], S33, 0xF6BB4B60);
    c = HH(c, b, a, d, x[k + 10], S34, 0xBEBFBC70);
    c = HH(c, b, a, d, x[k + 13], S31, 0x289B7EC6);
    d = II(d, c, b, a, x[k + 0], S41, 0xEAA127FA);
    d = II(d, c, b, a, x[k + 7], S42, 0xD4EF3085);
    d = II(d, c, b, a, x[k + 14], S43, 0x04881D05);
    d = II(d, c, b, a, x[k + 5], S44, 0xD9D4D039);
    d = II(d, c, b, a, x[k + 12], S41, 0xE6DB99E5);
    d = II(d, c, b, a, x[k + 3], S42, 0x1FA27CF8);
    d = II(d, c, b, a, x[k + 10], S43, 0xC4AC5665);
    d = II(d, c, b, a, x[k + 1], S44, 0xF4292244);
    d = II(d, c, b, a, x[k + 8], S41, 0x432AFF97);
    d = II(d, c, b, a, x[k + 15], S42, 0xAB9423A7);
    d = II(d, c, b, a, x[k + 6], S43, 0xFC93A039);
    d = II(d, c, b, a, x[k + 13], S44, 0x655B59C3);
    d = II(d, c, b, a, x[k + 4], S41, 0x8F0CCC92);
    d = II(d, c, b, a, x[k + 9], S42, 0xFFEFF47D);
    d = II(d, c, b, a, x[k + 2], S43, 0x85845DD1);
    d = II(d, c, b, a, x[k + 11], S44, 0x6FA87E4F);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

function adminInit() {
  const el = document.getElementById('admin-panel');
  if (!el) return;
  if (!isLogged()) {
    el.innerHTML = `<div class='box'>
      <h2>Login Admin</h2>
      <input type='password' id='admin-pass' placeholder='Senha'>
      <button onclick='doLogin()'>Entrar</button>
      <button onclick='showChangePassword()'>Alterar Senha</button>
      <div id='login-msg'></div>
    </div>`;
    return;
  }
  renderAdminPanel();
}

function isLogged() {
  return sessionStorage.getItem('adminLogged') === 'true';
}
function doLogin() {
  const pass = document.getElementById('admin-pass').value;
  if (loginAttempts >= 5) {
    document.getElementById('login-msg').innerText = 'Bloqueado por excesso de tentativas.';
    return;
  }
  if (md5(pass) === getAdminHash()) {
    sessionStorage.setItem('adminLogged', 'true');
    loginAttempts = 0;
    adminInit();
  } else {
    loginAttempts++;
    document.getElementById('login-msg').innerText = 'Senha incorreta.' + (loginAttempts >= 5 ? ' Bloqueado.' : '');
  }
function showChangePassword() {
  const el = document.getElementById('admin-panel');
  el.innerHTML = `<div class='box'>
    <h2>Alterar Senha Admin</h2>
    <input type='password' id='old-pass' placeholder='Senha atual'>
    <input type='password' id='new-pass' placeholder='Nova senha'>
    <button onclick='changePassword()'>Salvar</button>
    <button onclick='adminInit()'>Cancelar</button>
    <div id='login-msg'></div>
  </div>`;
}
function changePassword() {
  const oldPass = document.getElementById('old-pass').value;
  const newPass = document.getElementById('new-pass').value;
  if (md5(oldPass) !== getAdminHash()) {
    document.getElementById('login-msg').innerText = 'Senha atual incorreta.';
    return;
  }
  if (!newPass || newPass.length < 5) {
    document.getElementById('login-msg').innerText = 'Nova senha deve ter pelo menos 5 caracteres.';
    return;
  }
  setAdminHash(md5(newPass));
  document.getElementById('login-msg').innerText = 'Senha alterada com sucesso!';
  setTimeout(adminInit, 1200);
}
}
function logout() {
  sessionStorage.removeItem('adminLogged');
  adminInit();
}
function renderAdminPanel() {
  const data = getData();
  const el = document.getElementById('admin-panel');
  el.innerHTML = `<div class='box'>
    <h2>Páginas</h2>
    <button onclick='logout()'>Sair</button>
    <button onclick='exportData()'>Exportar JSON</button>
    <input type='file' id='import-file' accept='.json' style='display:none' onchange='importData(event)'>
    <button onclick="document.getElementById('import-file').click()">Importar JSON</button>
    <div id='pages-list'></div>
    <button onclick='showCreatePage()'>Criar Nova Página</button>
    <hr>
    <h2>Catálogo</h2>
    <div id='catalog-list'></div>
    <button onclick='showCreateCatalogItem()'>Adicionar Item ao Catálogo</button>
  </div>`;
  renderPagesList();
  renderCatalogList();
function renderCatalogList() {
  const data = getData();
  const el = document.getElementById('catalog-list');
  if (!el) return;
  el.innerHTML = data.catalogItems.map((item, i) =>
    `<div class='card'>
      <strong>${item.title}</strong> <small>(${item.slug})</small>
      <p>${item.description || ''}</p>
      <button onclick='editCatalogItem(${i})'>Editar</button>
      <button onclick='deleteCatalogItem(${i})'>Excluir</button>
    </div>`
  ).join('');
}

function showCreateCatalogItem() {
  const el = document.getElementById('admin-panel');
  el.innerHTML = `<div class='box'>
    <h2>Adicionar Item ao Catálogo</h2>
    <input type='text' id='catalog-title' placeholder='Título'>
    <textarea id='catalog-description' placeholder='Descrição'></textarea>
    <input type='text' id='catalog-slug' placeholder='Slug (opcional)'>
    <button onclick='saveNewCatalogItem()'>Salvar</button>
    <button onclick='adminInit()'>Cancelar</button>
  </div>`;
}

function saveNewCatalogItem() {
  const title = document.getElementById('catalog-title').value;
  const description = document.getElementById('catalog-description').value;
  let slug = document.getElementById('catalog-slug').value;
  if (!slug) slug = slugify(title);
  const data = getData();
  data.catalogItems.push({ title, description, slug });
  setData(data);
  adminInit();
}

function editCatalogItem(idx) {
  const data = getData();
  const item = data.catalogItems[idx];
  const el = document.getElementById('admin-panel');
  el.innerHTML = `<div class='box'>
    <h2>Editar Item do Catálogo</h2>
    <input type='text' id='catalog-title' value='${item.title}'>
    <textarea id='catalog-description'>${item.description || ''}</textarea>
    <input type='text' id='catalog-slug' value='${item.slug}'>
    <button onclick='saveEditCatalogItem(${idx})'>Salvar</button>
    <button onclick='adminInit()'>Cancelar</button>
  </div>`;
}

function saveEditCatalogItem(idx) {
  const title = document.getElementById('catalog-title').value;
  const description = document.getElementById('catalog-description').value;
  let slug = document.getElementById('catalog-slug').value;
  if (!slug) slug = slugify(title);
  const data = getData();
  data.catalogItems[idx] = { title, description, slug };
  setData(data);
  adminInit();
}

function deleteCatalogItem(idx) {
  const data = getData();
  if (confirm('Excluir item do catálogo?')) {
    data.catalogItems.splice(idx, 1);
    setData(data);
    adminInit();
  }
}
}
function renderPagesList() {
  const data = getData();
  const el = document.getElementById('pages-list');
  if (!el) return;
  el.innerHTML = data.pages.map((p, i) =>
    `<div class='card'>
      <strong>${p.title}</strong> <small>(${p.slug})</small>
      <button onclick='editPage(${i})'>Editar</button>
      <button onclick='deletePage(${i})'>Excluir</button>
    </div>`
  ).join('');
}
function showCreatePage() {
  const el = document.getElementById('admin-panel');
  el.innerHTML = `<div class='box'>
    <h2>Criar Página</h2>
    <input type='text' id='page-title' placeholder='Título'>
    <textarea id='page-content' placeholder='Conteúdo'></textarea>
    <button onclick='saveNewPage()'>Salvar</button>
    <button onclick='adminInit()'>Cancelar</button>
  </div>`;
}
function saveNewPage() {
  const title = document.getElementById('page-title').value;
  const content = document.getElementById('page-content').value;
  const slug = slugify(title);
  const data = getData();
  data.pages.push({ title, content, slug });
  // Adiciona ao catálogo se não existir
  if (!data.catalogItems.some(item => item.slug === slug)) {
    data.catalogItems.push({ title, description: content, slug });
  }
  setData(data);
  adminInit();
}
function editPage(idx) {
  const data = getData();
  const page = data.pages[idx];
  const el = document.getElementById('admin-panel');
  el.innerHTML = `<div class='box'>
    <h2>Editar Página</h2>
    <input type='text' id='page-title' value='${page.title}'>
    <textarea id='page-content'>${page.content}</textarea>
    <button onclick='saveEditPage(${idx})'>Salvar</button>
    <button onclick='adminInit()'>Cancelar</button>
  </div>`;
}
function saveEditPage(idx) {
  const title = document.getElementById('page-title').value;
  const content = document.getElementById('page-content').value;
  const slug = slugify(title);
  const data = getData();
  data.pages[idx] = { title, content, slug };
  setData(data);
  adminInit();
}
function deletePage(idx) {
  const data = getData();
  if (confirm('Excluir página?')) {
    data.pages.splice(idx, 1);
    setData(data);
    adminInit();
  }
}
function exportData() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meu-cms-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      setData(data);
      adminInit();
    } catch {
      alert('Arquivo inválido.');
    }
  };
  reader.readAsText(file);
}
