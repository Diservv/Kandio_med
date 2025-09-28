// Renderização de páginas públicas
function renderCatalogo(filtro = "") {
  const data = getData();
  const el = document.getElementById('catalogo');
  if (!el) return;
  let items = data.catalogItems;
  if (filtro) {
    items = items.filter(item => item.title.toLowerCase().includes(filtro));
  }
  if (!items.length) {
    el.innerHTML = '<p>Nenhum item no catálogo.</p>';
    return;
  }
  el.innerHTML = items.map(item =>
    `<div class='card'>
      ${item.img ? `<img src='${item.img}' alt='${item.title}' class='catalog-img'>` : ''}
      <h2>${item.title}</h2>
      <p>${item.description || ''}</p>
      <a href='page.html?slug=${item.slug}'>Ver página</a>
    </div>`
  ).join('');
}
function renderPagina(slug) {
  const page = findPageBySlug(slug);
  const el = document.getElementById('pagina');
  if (!el) return;
  if (!page) {
    el.innerHTML = '<p>Página não encontrada.</p>';
    return;
  }
  // Render básico do template
  el.innerHTML = `<div class='box'>
    <h1>${page.title}</h1>
    <div>${page.content || ''}</div>
  </div>`;
}
