// Função utilitária para slugs
function slugify(str) {
	return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const ADMIN_PASSWORD_KEY = 'meuCMSAdminSenha';
const DEFAULT_PASS = 'admin123';

// ----------------- Funções de dados -----------------
function getData() {
	return JSON.parse(localStorage.getItem('meuCMSData') || '{"pages":[],"catalogItems":[],"pageViews":{}}');
}

function setData(data) {
	localStorage.setItem('meuCMSData', JSON.stringify(data));
}

function registerPageView(slug) {
	const data = getData();
	if (!data.pageViews) data.pageViews = {};
	data.pageViews[slug] = (data.pageViews[slug] || 0) + 1;
	setData(data);
}

function getAdminPass() {
	return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASS;
}

function setAdminPass(pass) {
	localStorage.setItem(ADMIN_PASSWORD_KEY, pass);
}

// ----------------- Login -----------------
function doLogin() {
	var senha = document.getElementById('admin-pass').value;
	var msg = document.getElementById('login-msg');
	if (senha === getAdminPass()) {
		sessionStorage.setItem('adminLogged', 'true');
		msg.innerText = 'Login realizado!';
		setTimeout(adminInit, 500);
	} else {
		msg.innerText = 'Senha incorreta.';
	}
}

function isLogged() {
	return sessionStorage.getItem('adminLogged') === 'true';
}

function logout() {
	sessionStorage.removeItem('adminLogged');
	adminInit();
}

// ----------------- Painel Admin -----------------
function adminInit() {
	const el = document.getElementById('admin-panel');
	if (!el) return;

	if (!isLogged()) {
		el.innerHTML = `<div class='box'>
			<h2>Login Admin</h2>
			<input type='password' id='admin-pass' placeholder='Senha'>
			<button onclick='doLogin()'>Entrar</button>
			<div id='login-msg'></div>
		</div>`;
		return;
	}

	el.innerHTML = `<div class='box'>
		<h2>Dashboard</h2>
		<div id='dashboard'></div>
		<hr>
		<h2>Páginas</h2>
		<button onclick='showCreatePage()'>Criar Nova Página</button>
		<div id='pages-list'></div>
		<hr>
		<h2>Catálogo</h2>
		<button onclick='showCreateCatalogItem()'>Adicionar Item ao Catálogo</button>
		<div id='catalog-list'></div>
		<hr>
		<button onclick='logout()'>Sair</button>
	</div>`;

	renderDashboard();
	renderPagesList();
	renderCatalogList();
}

// ----------------- Dashboard -----------------
function renderDashboard() {
	const data = getData();
	const el = document.getElementById('dashboard');
	if (!el) return;
	const views = data.pageViews || {};
	const pages = data.pages;

	if (pages.length === 0) {
		el.innerHTML = '<em>Nenhuma página criada ainda.</em>';
		return;
	}

	const sorted = [...pages].map(p => ({
		title: p.title,
		slug: p.slug,
		views: views[p.slug] || 0
	})).sort((a, b) => b.views - a.views);

	el.innerHTML = `<table style='width:100%;border-collapse:collapse;'>
		<tr><th>Página</th><th>Visualizações</th></tr>
		${sorted.map(p => `<tr><td>${p.title}</td><td>${p.views}</td></tr>`).join('')}
	</table>`;
}

// ----------------- Páginas -----------------
function renderPagesList() {
	const data = getData();
	const el = document.getElementById('pages-list');
	if (!el) return;
	el.innerHTML = data.pages.map((p, i) =>
		`<div class='card'>
			<strong>${p.title}</strong><br>
			<label>Imagem:</label><br>
<input type="file" id="page-image-file" accept="image/*" onchange="previewImage(event)">
<input type="text" id="page-image" placeholder="Ou insira a URL da imagem"><br>
<img id="preview" style="max-width:150px;display:none;margin-top:5px;">
		</div>`
	).join('');
}

function viewPage(idx) {
	const data = getData();
	const page = data.pages[idx];
	registerPageView(page.slug);
	const el = document.getElementById('admin-panel');
	el.innerHTML = `<div class='box'>
		<h2>${page.title}</h2>
		${page.image ? `<img src="${page.image}" style="max-width:200px;">` : ''}
		<div>${page.content}</div>
		<button onclick='adminInit()'>Voltar</button>
	</div>`;
}

function showCreatePage() {
	const el = document.getElementById('admin-panel');
	el.innerHTML = `<div class='box'>
		<h2>Criar Página</h2>
		<input type='text' id='page-title' placeholder='Título'><br>
		<textarea id='page-content' placeholder='Conteúdo'></textarea><br>
		<input type='text' id='page-image' placeholder='URL da Imagem'><br>
		<button onclick='saveNewPage()'>Salvar</button>
		<button onclick='adminInit()'>Cancelar</button>
	</div>`;
}

function saveNewPage() {
	const title = document.getElementById('page-title').value;
	const content = document.getElementById('page-content').value;
	const image = document.getElementById('page-image').value;
	const slug = slugify(title);
	const data = getData();
	data.pages.push({ title, content, image, slug });
	setData(data);
	adminInit();
}

function editPage(idx) {
	const data = getData();
	const page = data.pages[idx];
	const el = document.getElementById('admin-panel');
	el.innerHTML = `<div class='box'>
		<h2>Editar Página</h2>
		<input type='text' id='page-title' value='${page.title}'><br>
		<textarea id='page-content'>${page.content}</textarea><br>
		<input type='text' id='page-image' value='${page.image || ''}'><br>
		<button onclick='saveEditPage(${idx})'>Salvar</button>
		<button onclick='adminInit()'>Cancelar</button>
	</div>`;
}

function saveEditPage(idx) {
	const title = document.getElementById('page-title').value;
	const content = document.getElementById('page-content').value;
	const image = document.getElementById('page-image').value;
	const slug = slugify(title);
	const data = getData();
	data.pages[idx] = { title, content, image, slug };
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

// ----------------- Catálogo -----------------
function renderCatalogList() {
	const data = getData();
	const el = document.getElementById('catalog-list');
	if (!el) return;
	el.innerHTML = data.catalogItems.map((item, i) =>
		`<div class='card'>
			<strong>${item.title}</strong><br>
			${item.image ? `<img src="${item.image}" style="max-width:100px;display:block;margin:5px 0;">` : ''}
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
		<input type='text' id='catalog-title' placeholder='Título'><br>
		<textarea id='catalog-description' placeholder='Descrição'></textarea><br>
		<input type='text' id='catalog-image' placeholder='URL da Imagem'><br>
		<button onclick='saveNewCatalogItem()'>Salvar</button>
		<button onclick='adminInit()'>Cancelar</button>
	</div>`;
}

function saveNewCatalogItem() {
	const title = document.getElementById('catalog-title').value;
	const description = document.getElementById('catalog-description').value;
	const image = document.getElementById('catalog-image').value;
	const slug = slugify(title);
	const data = getData();

	data.catalogItems.push({ title, description, image, slug });

	// Criar página correspondente
	if (!data.pages.some(p => p.slug === slug)) {
		data.pages.push({ title, content: description, image, slug });
	}

	setData(data);
	adminInit();
}

function editCatalogItem(idx) {
	const data = getData();
	const item = data.catalogItems[idx];
	const el = document.getElementById('admin-panel');
	el.innerHTML = `<div class='box'>
		<h2>Editar Item do Catálogo</h2>
		<input type='text' id='catalog-title' value='${item.title}'><br>
		<textarea id='catalog-description'>${item.description || ''}</textarea><br>
		<input type='text' id='catalog-image' value='${item.image || ''}'><br>
		<button onclick='saveEditCatalogItem(${idx})'>Salvar</button>
		<button onclick='adminInit()'>Cancelar</button>
	</div>`;
}

function saveEditCatalogItem(idx) {
	const title = document.getElementById('catalog-title').value;
	const description = document.getElementById('catalog-description').value;
	const image = document.getElementById('catalog-image').value;
	const slug = slugify(title);
	const data = getData();

	data.catalogItems[idx] = { title, description, image, slug };

	// Atualizar página correspondente
	const pageIndex = data.pages.findIndex(p => p.slug === slug);
	if (pageIndex >= 0) {
		data.pages[pageIndex] = { title, content: description, image, slug };
	}

	setData(data);
	adminInit();
}

function deleteCatalogItem(idx) {
	const data = getData();
	if (confirm('Excluir item do catálogo?')) {
		const slug = data.catalogItems[idx].slug;
		data.catalogItems.splice(idx, 1);
		// remover também a página vinculada
		data.pages = data.pages.filter(p => p.slug !== slug);
		setData(data);
		adminInit();
	}
}

// ----------------- Escopo global -----------------
window.adminInit = adminInit;
window.doLogin = doLogin;
window.logout = logout;

window.showCreatePage = showCreatePage;
window.saveNewPage = saveNewPage;
window.editPage = editPage;
window.saveEditPage = saveEditPage;
window.deletePage = deletePage;
window.viewPage = viewPage;

window.showCreateCatalogItem = showCreateCatalogItem;
window.saveNewCatalogItem = saveNewCatalogItem;
window.editCatalogItem = editCatalogItem;
window.saveEditCatalogItem = saveEditCatalogItem;
window.deleteCatalogItem = deleteCatalogItem;
